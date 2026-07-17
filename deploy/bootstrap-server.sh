#!/usr/bin/env bash
set -Eeuo pipefail

DOMAIN="${DOMAIN:-rtmgroupdocs.fvds.ru}"
REPOSITORY="${REPOSITORY:-https://github.com/andreyabramovworks-commits/RTM-education-Bitrix.git}"
ADMIN_PUBLIC_KEY="${ADMIN_PUBLIC_KEY:?Set ADMIN_PUBLIC_KEY before running}"
APP_DIR="/opt/rtm-app"

if [[ "${EUID}" -ne 0 ]]; then
    echo "Run this script as root" >&2
    exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl fail2ban git gnupg openssl unattended-upgrades ufw

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
. /etc/os-release
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${UBUNTU_CODENAME} stable" > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker

if ! id rtmadmin >/dev/null 2>&1; then
    useradd --create-home --shell /bin/bash rtmadmin
fi
usermod -aG sudo,docker rtmadmin
install -d -m 0700 -o rtmadmin -g rtmadmin /home/rtmadmin/.ssh
printf '%s\n' "$ADMIN_PUBLIC_KEY" > /home/rtmadmin/.ssh/authorized_keys
chown rtmadmin:rtmadmin /home/rtmadmin/.ssh/authorized_keys
chmod 0600 /home/rtmadmin/.ssh/authorized_keys
echo 'rtmadmin ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/90-rtmadmin
chmod 0440 /etc/sudoers.d/90-rtmadmin

if ! id rtmdeploy >/dev/null 2>&1; then
    useradd --system --create-home --shell /usr/sbin/nologin rtmdeploy
fi
usermod -aG docker rtmdeploy

if [[ ! -d "$APP_DIR/.git" ]]; then
    git clone "$REPOSITORY" "$APP_DIR"
fi
chown -R rtmdeploy:rtmdeploy "$APP_DIR"

if [[ ! -f "$APP_DIR/.env" ]]; then
    DB_PASSWORD="$(openssl rand -hex 32)"
    cat > "$APP_DIR/.env" <<EOF
POSTGRES_DB=rtm_education
POSTGRES_USER=rtm_app
POSTGRES_PASSWORD=${DB_PASSWORD}
APP_ENV=production
APP_VERSION=bootstrap
DOMAIN=${DOMAIN}
EOF
    chown rtmdeploy:rtmdeploy "$APP_DIR/.env"
    chmod 0600 "$APP_DIR/.env"
fi

install -m 0755 "$APP_DIR/deploy/rtm-deploy.sh" /usr/local/bin/rtm-deploy
install -m 0644 "$APP_DIR/deploy/rtm-deploy.service" /etc/systemd/system/rtm-deploy.service
install -m 0644 "$APP_DIR/deploy/rtm-deploy.timer" /etc/systemd/system/rtm-deploy.timer

cat > /etc/fail2ban/jail.d/sshd.local <<'EOF'
[sshd]
enabled = true
bantime = 1h
findtime = 10m
maxretry = 5
EOF
systemctl enable --now fail2ban

ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp
ufw --force enable

systemctl daemon-reload
systemctl enable rtm-deploy.timer
systemctl enable --now unattended-upgrades

echo "Bootstrap complete. Test SSH as rtmadmin before disabling password login."

