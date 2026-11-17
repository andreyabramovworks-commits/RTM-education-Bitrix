from fastapi import HTTPException
from sqlmodel import Session, SQLModel, create_engine, select

from app.models import AppUser, VideoCollection, VideoItem, VideoProgress
from app.video import ProgressWrite, _allowed, _embed, _rutube_channel_id, save_progress


def test_youtube_links_use_privacy_enhanced_embed():
    provider, external_id, embed = _embed("https://www.youtube.com/watch?v=abcDEF_123")
    assert provider == "youtube"
    assert external_id == "abcDEF_123"
    assert embed == "https://www.youtube-nocookie.com/embed/abcDEF_123"


def test_rutube_private_link_preserves_playback_key():
    provider, external_id, embed = _embed("https://rutube.ru/video/private/abc123/?p=secret")
    assert provider == "rutube"
    assert external_id == "abc123"
    assert embed == "https://rutube.ru/play/embed/abc123/?p=secret"


def test_rutube_short_uses_embedded_player():
    provider, external_id, embed = _embed("https://rutube.ru/shorts/2c4181fca185888c0d3b77a9367d2dce/")
    assert provider == "rutube"
    assert external_id == "2c4181fca185888c0d3b77a9367d2dce"
    assert embed == "https://rutube.ru/play/embed/2c4181fca185888c0d3b77a9367d2dce/"


def test_rutube_channel_url_extracts_public_channel_id():
    assert _rutube_channel_id("https://rutube.ru/channel/47531598/") == "47531598"


def test_unknown_video_host_is_rejected():
    try:
        _embed("https://example.com/watch/123")
    except HTTPException as error:
        assert error.status_code == 422
    else:
        raise AssertionError("Unsupported video URL must be rejected")


def test_restricted_video_audience_is_enforced():
    identity = type("Identity", (), {"user": AppUser(id=7, bitrix_user_id="42", role="student", department_ids=["9"])})()
    assert _allowed("all", [], identity)
    assert _allowed("restricted", [{"type": "department", "id": "9"}], identity)
    assert not _allowed("restricted", [{"type": "role", "id": "admin"}], identity)


def test_progress_respects_video_and_collection_visibility():
    engine = create_engine("sqlite://")
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        user = AppUser(bitrix_user_id="42", role="student")
        folder = VideoCollection(title="Закрытая папка", visibility="restricted", audience_rules=[{"type": "role", "id": "admin"}])
        session.add_all([user, folder]); session.flush()
        video = VideoItem(title="Видео", collection_id=folder.id, status="published")
        session.add(video); session.commit()
        identity = type("Identity", (), {"user": user})()
        for blocked in (True, False):
            if not blocked:
                folder.visibility = "all"
                video.visibility = "restricted"
                video.audience_rules = [{"type": "role", "id": "admin"}]
                session.add_all([folder, video]); session.commit()
            try:
                save_progress(video.id, ProgressWrite(watchedSeconds=20, percent=100), session, identity)
            except HTTPException as error:
                assert error.status_code == 404
            else:
                raise AssertionError("Hidden video must not record progress")
            assert session.exec(select(VideoProgress)).all() == []
        video.visibility = "all"
        video.status = "draft"
        session.add(video); session.commit()
        try:
            save_progress(video.id, ProgressWrite(watchedSeconds=20, percent=100), session, identity)
        except HTTPException as error:
            assert error.status_code == 404
        else:
            raise AssertionError("Draft video must not record progress")
        video.status = "published"
        session.add(video); session.commit()
        folder.archived = True
        session.add(folder); session.commit()
        try:
            save_progress(video.id, ProgressWrite(watchedSeconds=20, percent=100), session, identity)
        except HTTPException as error:
            assert error.status_code == 404
        else:
            raise AssertionError("Archived folder must not accept progress")
        folder.archived = False
        session.add(folder); session.commit()
        assert save_progress(video.id, ProgressWrite(watchedSeconds=20, percent=100), session, identity)["percent"] == 100
