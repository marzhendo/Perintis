import sys
import re

with open('backend/app/services/pihps_service.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace all print with logger.info/warning/error
code = code.replace('print(f"  Warning: Error fetching', 'logger.warning(f"Error fetching')
code = code.replace('print(f"  Warning: Error parsing province data: {e}")', 'logger.warning(f"Error parsing province data: {e}")')
code = code.replace('print(f"[{datetime.now()}] Starting BI hargapangan price update...")', 'logger.info("Starting BI hargapangan price update...")')
code = code.replace('print(f"  Session established', 'logger.info(f"Session established')
code = code.replace('print("  Fetching national prices...")', 'logger.info("Fetching national prices...")')
code = code.replace('print(f"    {com[\'name\']}: Rp', 'logger.info(f"{com[\'name\']}: Rp')
code = code.replace('print(f"    {com[\'name\']}: Failed to fetch — keeping previous price")', 'logger.warning(f"{com[\'name\']}: Failed to fetch — keeping previous price")')
code = code.replace('print(f"  Per-province prices extracted:', 'logger.info(f"Per-province prices extracted:')
code = code.replace('print("  Warning: No per-province prices found in HTML")', 'logger.warning("No per-province prices found in HTML")')
code = code.replace('print(f"[{datetime.now()}] Price update completed.', 'logger.info(f"Price update completed.')
code = code.replace('print(f"[{datetime.now()}] Error during price update: {e}")', 'logger.error(f"Error during price update: {e}", exc_info=True)')


new_updater = '''
def is_data_stale_or_empty(data: dict) -> bool:
    today_str = datetime.now().strftime("%d %b %Y")
    if data.get("last_updated") != today_str:
        return True
    provinces = data.get("province_beras_medium_i", {})
    if not provinces:
        return True
    if all(val == 0 for val in provinces.values()):
        return True
    return False

def start_price_updater():
    """Background thread that updates prices daily at 07:00 local time."""
    logger.info("Background Daily Price Updater Started (Source: Bank Indonesia PIHPS)")
    
    # Run once at startup if data is stale or empty
    try:
        data = _load_price_file()
        if is_data_stale_or_empty(data):
            logger.info("Data is stale or empty (provinces are 0). Triggering immediate scrape.")
            update_prices()
        else:
            logger.info("Data is fresh. Skipping startup scrape.")
    except Exception as e:
        logger.error(f"Startup price update error: {e}", exc_info=True)
    
    while True:
        try:
            now = datetime.now()
            next_run = now.replace(hour=7, minute=0, second=0, microsecond=0)
            if now >= next_run:
                next_run += timedelta(days=1)
            
            sleep_seconds = (next_run - now).total_seconds()
            time.sleep(min(sleep_seconds, 60))
            
            now_check = datetime.now()
            if now_check.hour == 7 and now_check.minute == 0:
                update_prices()
                time.sleep(65)  # Skip rest of this minute
        except Exception as e:
            logger.error(f"Error in background updater: {e}", exc_info=True)
            time.sleep(60)

# manual trigger for testing
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    update_prices()
'''

code = re.sub(r'def start_price_updater\(\):.*', new_updater.strip(), code, flags=re.DOTALL)

with open('backend/app/services/pihps_service.py', 'w', encoding='utf-8') as f:
    f.write(code)
