import json

config_file_path = "config.json"

# File ko safe tarike se open karo
with open(config_file_path, "r") as config_file_object:
    config_file = json.load(config_file_object)
