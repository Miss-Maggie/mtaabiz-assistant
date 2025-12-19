# import requests
# import logging
# from django.conf import settings

# logger = logging.getLogger(__name__)

# def send_sms(phone_number, message):
#     """
#     Sends an SMS via the local Android Gateway.
#     Default branding [MtaaBiz] is added to the start.
#     """
#     url = getattr(settings, 'SMS_GATEWAY_URL', 'http://192.168.0.100:8080/send')
    
#     # Prefix message with branding
#     branded_message = f"[MtaaBiz] {message}"
    
#     payload = {
#         "to": phone_number,
#         "message": branded_message
#     }
    
#     try:
#         # Most gateway apps expect JSON. Some use form-data. 
#         # We start with JSON.
#         response = requests.post(url, json=payload, timeout=10)
#         response.raise_for_status()
#         return True, "SMS sent successfully"
#     except Exception as e:
#         logger.error(f"Failed to send SMS: {str(e)}")
#         return False, str(e)
