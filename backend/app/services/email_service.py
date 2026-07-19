import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from ..core.config import config

logger = logging.getLogger(__name__)


def send_otp_email(to_email: str, otp_code: str, purpose: str = "reset_password") -> bool:
    """
    Sends an OTP code via SMTP email if SMTP is configured.
    Otherwise, logs it and prints it to stdout for local development.
    """
    # 1. Check if SMTP is configured
    if not all([config.SMTP_HOST, config.SMTP_USER, config.SMTP_PASSWORD]):
        logger.warning(
            f"SMTP is not fully configured (SMTP_HOST, SMTP_USER, or SMTP_PASSWORD missing). "
            f"FALLBACK: OTP Code for {to_email} is: {otp_code} (Purpose: {purpose})"
        )
        print(f"\n================[ DEV OTP CODES ]================\n")
        print(f"  Email:   {to_email}")
        print(f"  OTP:     {otp_code}")
        print(f"  Purpose: {purpose}")
        print(f"\n=================================================\n")
        return True

    # 2. Setup email details based on purpose
    subject = "Kode OTP Verifikasi Perintis"
    action_text = "mengatur ulang kata sandi Anda" if purpose == "reset_password" else "memverifikasi email Anda"

    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #171C38; line-height: 1.6; background-color: #FAF6EE; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #E8E8E8; border-radius: 24px; box-shadow: 0 4px 12px rgba(23,28,56,0.05);">
          <h2 style="color: #FF6B1A; margin-top: 0; font-family: 'Inter', Arial, sans-serif;">Perintis UMKM</h2>
          <p style="font-size: 14px;">Halo,</p>
          <p style="font-size: 14px;">Kami menerima permintaan untuk {action_text}. Silakan gunakan kode OTP di bawah ini untuk melanjutkan:</p>
          <div style="font-size: 28px; font-weight: bold; background-color: #FAF6EE; border: 1px dashed #FF6B1A; padding: 20px; text-align: center; margin: 25px 0; border-radius: 18px; letter-spacing: 6px; color: #171C38;">
            {otp_code}
          </div>
          <p style="font-size: 12px; color: #6F7178;">Kode OTP ini berlaku selama 10 menit. Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini.</p>
          <hr style="border: none; border-top: 1px solid #E8E8E8; margin: 25px 0;" />
          <p style="font-size: 11px; color: #6F7178; text-align: center;">Perintis UMKM — Solusi Wirausaha Cerdas Terintegrasi AI</p>
        </div>
      </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{config.SMTP_FROM_NAME} <{config.SMTP_USER}>"
    msg["To"] = to_email
    msg.attach(MIMEText(html_content, "html"))

    try:
        # Use STARTTLS or SSL based on port
        if config.SMTP_PORT == 465:
            server = smtplib.SMTP_SSL(config.SMTP_HOST, config.SMTP_PORT, timeout=10)
        else:
            server = smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT, timeout=10)
            server.starttls()

        server.login(config.SMTP_USER, config.SMTP_PASSWORD)
        server.sendmail(config.SMTP_USER, to_email, msg.as_string())
        server.quit()
        logger.info(f"Successfully sent OTP email to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send OTP email to {to_email}: {e}")
        # Log the OTP code anyway so developers can copy it from logs even if SMTP fails
        logger.warning(f"FALLBACK LOG: OTP Code for {to_email} is: {otp_code}")
        return False
