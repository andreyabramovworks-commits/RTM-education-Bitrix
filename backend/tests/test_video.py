from fastapi import HTTPException

from app.models import AppUser
from app.video import _allowed, _embed, _rutube_channel_id


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
