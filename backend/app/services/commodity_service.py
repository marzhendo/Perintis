import json
import os


def get_all_commodities():
    path = os.path.join(os.path.dirname(__file__), "..", "data", "commodity_prices.json")
    with open(path) as f:
        data = json.load(f)
    return data["commodities"]
