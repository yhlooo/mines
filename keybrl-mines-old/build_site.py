import json
import os
import shutil


config = {
    'config_file': './build_config.json',
    'root_path': './',
    'output_path': './site/',

    'replaces_mod': {},
    'drop_paths': [  # 直接丢弃，无需处理的路径
        '.git/',
        '.idea/',
        'site/',
        '.gitignore',
        'build_site.py',
        'build_config.json',
        'LICENSE',
        'README.md',
    ],
    'accept_paths': [  # 直接拷贝，无需处理的路径
        'assets/',
        'CNAME',
    ],
    'except_paths': [

    ]

}


def in_paths(file, paths):
    for path in paths:
        if os.path.isdir(path):  # dir
            if file[0].find(path) == 0:
                return True
        else:                    # file
            if file[0] + file[1] == path:
                return True
    return False


def text_replace(file_path, replaces_mod):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    for replace_mod in replaces_mod.items():
        content = content.replace(str(replace_mod[0]), replace_mod[1])
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)
    print('replace {file_path}'.format(file_path=file_path))


def copy_file(old, new):
    if not os.path.exists(new[0]):
        os.makedirs(new[0])
    shutil.copyfile(
        os.path.join(old[0], old[1]),
        os.path.join(new[0], new[1])
    )
    print('copy {path_dir}{filename}'.format(path_dir=old[0], filename=old[1]))


# 尝试加载配置文件
if config.get('config_file'):
    try:
        with open(config['config_file'], 'r') as config_file:
            for key, value in json.loads(config_file.read()).items():
                config[key] = value
    except FileNotFoundError:
        if 'Y' != input('配置文件不存在，使用默认配置继续？（Y 或 n）：'):
            exit()


# 读取全部文件路径
files_list = []
for path in os.walk(config['root_path']):
    for file in path[2]:
        path_real_format = path[0][len(config['root_path']):].replace('\\', '/')
        # path_real_format = path[0].replace('\\', '/')
        path_real_format += '/' if len(path_real_format) != 0 and path_real_format[-1] != '/' else path_real_format
        files_list.append([path_real_format, file])


# 筛除dorp的文件，标记是否需要处理
i = 0
while i < len(files_list):
    if in_paths(files_list[i], config['except_paths']):
        files_list[i].append(True)
    elif in_paths(files_list[i], config['drop_paths']):
        files_list.pop(i)
        i -= 1
    elif in_paths(files_list[i], config['accept_paths']):
        files_list[i].append(False)
    else:
        files_list[i].append(True)
    i += 1


# 判断输出路径是否已经存在
if os.path.exists(config['output_path']):
    if 'Y' != input(
        '输出路径\'{path}\'不为空，如果继续将清空该路径所有文件，是否继续？（Y 或 n）：'
        .format(path=config['output_path'])
    ):
        exit()
    else:
        if os.path.isdir(config['output_path']):
            shutil.rmtree(config['output_path'])
        else:
            os.remove(config['output_path'])


os.mkdir(config['output_path'])
for file in files_list:
    copy_file(
        [os.path.join(config['root_path'], file[0]), file[1]],
        [os.path.join(config['output_path'], file[0]), file[1]]
    )
    if file[2]:  # 处理的
        text_replace(os.path.join(config['output_path'], file[0], file[1]), config['replaces_mod'])
