from datetime import datetime, timezone
import json
from typing import Any

from sqlalchemy import delete
from sqlmodel import Session, select

from app.models import (
    AppUser, Article, Assignment, Course, CourseSection, ExcalidrawScene,
    KnowledgeTest, LearningProgress, LegacyRecord, Project, TestAttempt, utcnow,
)


def _json(value: Any) -> dict[str, Any]:
    if isinstance(value, dict):
        return value
    try:
        parsed = json.loads(value or "{}")
        return parsed if isinstance(parsed, dict) else {}
    except (TypeError, ValueError):
        return {}


def _int(value: Any, default: int = 0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _date(value: Any) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None


def sync_normalized(session: Session) -> None:
    """Project compatibility records into stable normalized rows.

    Existing normalized IDs and Excalidraw payloads are preserved, so this can
    safely run after every legacy-compatible write.
    """
    records = session.exec(select(LegacyRecord)).all()
    by_entity: dict[str, list[LegacyRecord]] = {}
    for row in records:
        by_entity.setdefault(row.entity, []).append(row)

    projects = {row.legacy_id: row for row in by_entity.get("rtm_prj", [])}
    project_rows = {row.legacy_id: row for row in session.exec(select(Project)).all() if row.legacy_id}
    project_map: dict[str, Project] = {}
    for legacy_id, source in projects.items():
        target = project_rows.get(legacy_id) or Project(legacy_id=legacy_id, title=source.name or "Проект")
        target.title = source.name or "Проект"
        target.description = str(source.properties.get("description") or "")
        target.position = _int(source.properties.get("order"))
        target.archived = source.properties.get("deleted") == "Y"
        target.updated_at = utcnow()
        session.add(target)
        session.flush()
        project_map[legacy_id] = target

    active_items = [row for row in by_entity.get("rtm_items", []) if row.properties.get("deleted") != "Y"]
    course_sources = {row.legacy_id: row for row in active_items if row.properties.get("type") == "course"}
    course_rows = {row.legacy_id: row for row in session.exec(select(Course)).all() if row.legacy_id}
    course_map: dict[str, Course] = {}
    desired_sections: set[int] = set()
    section_map: dict[tuple[str, str], CourseSection] = {}
    for legacy_id, source in course_sources.items():
        project = project_map.get(str(source.properties.get("projectId") or ""))
        if not project:
            continue
        meta = _json(source.properties.get("meta"))
        target = course_rows.get(legacy_id) or Course(project_id=project.id, legacy_id=legacy_id, title=source.name or "Курс")
        target.project_id = project.id
        target.title = source.name or "Курс"
        target.description = str(source.properties.get("content") or "")
        target.status = str(source.properties.get("status") or "draft")
        target.settings = meta
        target.position = _int(meta.get("order"))
        target.updated_at = utcnow()
        session.add(target)
        session.flush()
        course_map[legacy_id] = target
        existing_sections = {
            row.legacy_key: row for row in session.exec(
                select(CourseSection).where(CourseSection.course_id == target.id)
            ).all()
        }
        sections = meta.get("sections") or [{"id": "nosection", "title": "Без секции", "order": 0}]
        for index, data in enumerate(sections):
            key = str(data.get("id") or f"section_{index}")
            section = existing_sections.get(key) or CourseSection(course_id=target.id, legacy_key=key, title="Секция")
            section.title = str(data.get("title") or "Секция")
            section.position = _int(data.get("order"), index * 100)
            session.add(section)
            session.flush()
            desired_sections.add(section.id)
            section_map[(legacy_id, key)] = section

    def root_container(source: LegacyRecord) -> tuple[str, Course] | None:
        """Give project-level articles/tests a normalized home.

        The legacy editor intentionally allows materials directly under a
        project.  The normalized schema requires a course and a section, so a
        hidden system course preserves that hierarchy without changing the
        legacy UI.
        """
        project_legacy_id = str(source.properties.get("projectId") or "")
        project = project_map.get(project_legacy_id)
        if not project:
            return None
        container_key = f"__project_root__:{project_legacy_id}"
        course = course_map.get(container_key)
        if course is None:
            course = course_rows.get(container_key) or Course(
                project_id=project.id,
                legacy_id=container_key,
                title="Материалы проекта",
            )
            course.project_id = project.id
            course.title = "Материалы проекта"
            course.description = "Системный контейнер материалов вне курсов"
            course.status = "system"
            course.settings = {"system": True, "hidden": True}
            course.position = -1
            course.updated_at = utcnow()
            session.add(course)
            session.flush()
            course_map[container_key] = course

        section = section_map.get((container_key, "nosection"))
        if section is None:
            section = session.exec(select(CourseSection).where(
                CourseSection.course_id == course.id,
                CourseSection.legacy_key == "nosection",
            )).first() or CourseSection(
                course_id=course.id,
                legacy_key="nosection",
                title="Без секции",
            )
            section.position = 0
            session.add(section)
            session.flush()
            section_map[(container_key, "nosection")] = section
        desired_sections.add(section.id)
        return container_key, course

    article_sources = {row.legacy_id: row for row in active_items if row.properties.get("type") == "article"}
    article_rows = {row.legacy_id: row for row in session.exec(select(Article)).all() if row.legacy_id}
    article_map: dict[str, Article] = {}
    desired_scenes: set[int] = set()
    for legacy_id, source in article_sources.items():
        parent = str(source.properties.get("parentId") or "")
        course = course_map.get(parent)
        if not course:
            container = root_container(source)
            if not container:
                continue
            parent, course = container
        meta = _json(source.properties.get("meta"))
        section_key = str(meta.get("sectionId") or "nosection")
        section = section_map.get((parent, section_key)) or section_map.get((parent, "nosection"))
        if not section:
            section = CourseSection(course_id=course.id, legacy_key=section_key, title="Без секции")
            session.add(section)
            session.flush()
            desired_sections.add(section.id)
            section_map[(parent, section_key)] = section
        target = article_rows.get(legacy_id) or Article(section_id=section.id, legacy_id=legacy_id, title=source.name or "Статья")
        target.section_id = section.id
        target.title = source.name or "Статья"
        target.description = str(meta.get("description") or "")
        target.status = str(source.properties.get("status") or "draft")
        target.required = meta.get("required") in {True, "Y"}
        target.points = _int(meta.get("points"))
        target.position = _int(meta.get("order"))
        session.add(target)
        session.flush()
        article_map[legacy_id] = target
        existing_scenes = {
            row.page_key: row for row in session.exec(
                select(ExcalidrawScene).where(ExcalidrawScene.article_id == target.id)
            ).all()
        }
        pages = meta.get("pages") or [{"id": "page_0", "title": target.title}]
        for index, page in enumerate(pages):
            page_key = str(page.get("id") or f"page_{index}")
            scene = existing_scenes.get(page_key) or ExcalidrawScene(article_id=target.id, page_key=page_key)
            scene.title = str(page.get("title") or target.title)
            scene.legacy_meta = page
            scene.position = index * 100
            session.add(scene)
            session.flush()
            desired_scenes.add(scene.id)

    test_sources = {row.legacy_id: row for row in active_items if row.properties.get("type") == "test"}
    test_rows = {row.legacy_id: row for row in session.exec(select(KnowledgeTest)).all() if row.legacy_id}
    test_map: dict[str, KnowledgeTest] = {}
    for legacy_id, source in test_sources.items():
        parent = str(source.properties.get("parentId") or "")
        course = course_map.get(parent)
        if not course:
            container = root_container(source)
            if not container:
                continue
            parent, course = container
        meta = _json(source.properties.get("meta"))
        section_key = str(meta.get("sectionId") or "nosection")
        section = section_map.get((parent, section_key)) or section_map.get((parent, "nosection"))
        if not section:
            continue
        target = test_rows.get(legacy_id) or KnowledgeTest(section_id=section.id, legacy_id=legacy_id, title=source.name or "Тест")
        target.section_id = section.id
        target.title = source.name or "Тест"
        target.status = str(source.properties.get("status") or "draft")
        target.settings = {key: value for key, value in meta.items() if key != "questions"}
        target.questions = meta.get("questions") or []
        target.position = _int(meta.get("order"))
        session.add(target)
        session.flush()
        test_map[legacy_id] = target

    # Remove obsolete hierarchy rows from leaves to roots while preserving all
    # server scenes that still belong to a live page.
    for scene in session.exec(select(ExcalidrawScene)).all():
        if scene.id not in desired_scenes:
            session.delete(scene)
    for article in session.exec(select(Article)).all():
        if article.legacy_id not in article_map:
            session.delete(article)
    stale_test_ids = [row.id for row in session.exec(select(KnowledgeTest)).all() if row.legacy_id not in test_map]
    if stale_test_ids:
        session.exec(delete(TestAttempt).where(TestAttempt.test_id.in_(stale_test_ids)))
        session.exec(delete(KnowledgeTest).where(KnowledgeTest.id.in_(stale_test_ids)))
    session.flush()
    for section in session.exec(select(CourseSection)).all():
        if section.id not in desired_sections:
            session.delete(section)
    stale_course_ids = [row.id for row in session.exec(select(Course)).all() if row.legacy_id not in course_map]
    if stale_course_ids:
        session.exec(delete(Assignment).where(Assignment.course_id.in_(stale_course_ids)))
        session.exec(delete(Course).where(Course.id.in_(stale_course_ids)))
    session.flush()
    for project in session.exec(select(Project)).all():
        if project.legacy_id not in project_map:
            session.delete(project)
    session.flush()

    users = {row.bitrix_user_id: row for row in session.exec(select(AppUser)).all()}
    targets: dict[tuple[str, str], int] = {}
    targets.update({("course", key): row.id for key, row in course_map.items()})
    targets.update({("article", key): row.id for key, row in article_map.items()})
    targets.update({("test", key): row.id for key, row in test_map.items()})

    desired_assignments: set[str] = set()
    existing_assignments = {row.legacy_id: row for row in session.exec(select(Assignment)).all() if row.legacy_id}
    for source in by_entity.get("rtm_assigns", []):
        props = source.properties
        user = users.get(str(props.get("userId") or ""))
        kind = str(props.get("targetType") or "course")
        target_id = targets.get((kind, str(props.get("targetId") or props.get("courseId") or "")))
        if not user or not target_id:
            continue
        row = existing_assignments.get(source.legacy_id) or Assignment(user_id=user.id, target_id=target_id)
        row.legacy_id = source.legacy_id
        row.user_id = user.id
        row.target_type = kind
        row.target_id = target_id
        row.course_id = target_id if kind == "course" else None
        row.due_at = _date(props.get("dueAt"))
        session.add(row)
        desired_assignments.add(source.legacy_id)
    for row in session.exec(select(Assignment)).all():
        if row.legacy_id and row.legacy_id not in desired_assignments:
            session.delete(row)

    for source in by_entity.get("rtm_progress", []):
        props = source.properties
        user = users.get(str(props.get("userId") or ""))
        kind = str(props.get("targetType") or "course")
        target_id = targets.get((kind, str(props.get("targetId") or props.get("courseId") or "")))
        if not user or not target_id:
            continue
        row = session.exec(select(LearningProgress).where(
            LearningProgress.user_id == user.id,
            LearningProgress.target_type == kind,
            LearningProgress.target_id == target_id,
        )).first() or LearningProgress(user_id=user.id, target_type=kind, target_id=target_id)
        row.status = str(props.get("status") or "not_started")
        row.percent = _int(props.get("percent"), 100 if row.status == "completed" else 0)
        row.completed_at = _date(props.get("completedAt"))
        row.updated_at = utcnow()
        session.add(row)

    existing_attempts = {row.legacy_id: row for row in session.exec(select(TestAttempt)).all() if row.legacy_id}
    desired_attempts: set[str] = set()
    for source in by_entity.get("rtm_attempts", []):
        props = source.properties
        user = users.get(str(props.get("userId") or ""))
        test = test_map.get(str(props.get("testId") or ""))
        if not user or not test:
            continue
        row = existing_attempts.get(source.legacy_id) or TestAttempt(user_id=user.id, test_id=test.id)
        row.legacy_id = source.legacy_id
        row.user_id = user.id
        row.test_id = test.id
        row.answers = _json(props.get("answers"))
        row.score = _int(props.get("score"))
        row.passed = props.get("passed") in {True, "Y", "true", "1"}
        row.started_at = _date(props.get("createdAt")) or datetime.now(timezone.utc)
        row.completed_at = _date(props.get("completedAt"))
        session.add(row)
        desired_attempts.add(source.legacy_id)
    for row in session.exec(select(TestAttempt)).all():
        if row.legacy_id and row.legacy_id not in desired_attempts:
            session.delete(row)

    for source in by_entity.get("rtm_roles", []):
        user = users.get(str(source.properties.get("userId") or ""))
        if not user or user.is_bitrix_admin or user.bitrix_user_id == "36":
            continue
        legacy_role = str(source.properties.get("role") or "employee")
        mapped_role = {
            "admin": "admin",
            "editor": "editor",
            "moderator": "editor",
            "teacher": "teacher",
            "employee": "student",
            "student": "student",
        }.get(legacy_role, "student")
        user.manual_role = mapped_role
        user.role = mapped_role
        user.updated_at = utcnow()
        session.add(user)
    session.flush()
