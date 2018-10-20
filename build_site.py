import json
import os

config = {
    # 'config_file': './build_config.json',
    'root_path': '/home/keybrl/Documents/keybrl-mines/',
    'replaces': {
        'assets': 'hhh',
        'image': '2333',
    },
    'drop_paths': [
        '.git/',
        '.idea/',
    ],
    'drop_files': [],
    'accept_paths': [],
    'accept_files': [
        'fontawesome-webfont.ttf',
    ],

}


# 尝试加载配置文件
if config.get('config_file'):
    try:
        with open(config['config_file'], 'r') as config_file:
            for key, value in json.loads(config_file.read()).iteritems():
                config[key] = value
    except FileNotFoundError:
        if 'Y' != input('配置文件不存在，使用默认配置继续？（Y 或 n）：'):
            exit()


files_list = []
for path in os.walk(config['root_path']):
    for file in path[2]:
        files_list.append([path[0] + '/' if path[0][-1] != '/' else path[0], file])


# for path in os.walk(config['root_path']):
#     for drop_path in config['drop_paths']:
#         if config['root_path'] + drop_path[:-1] == path[0] or path[0].find(drop_path) == len(config['root_path']):
#             break
#     else:
#         for file in path[2]:
#             if file not in config['drop_files']:
#                 if file not in config['accept_files']:
#                     files_list.append([path[0][len(config['root_path']):], file, True])
#                 else:
#                     files_list.append([path[0][len(config['root_path']):], file, False])

for file in files_list:
    print(file)
