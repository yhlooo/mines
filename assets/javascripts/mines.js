let minefield_width = 30;
let minefield_height = 16;
let mines_num = 99;
let status = 'ready';  // 'ready', 'playing', 'die' or 'pause'

let minefield = Array();
for (let i = 0; i < minefield_height; i++) {
    minefield[i] = Array();
    for (let j = 0; j < minefield_width; j++) {
        minefield[i][j] = {
            id: 'cell' + i + '-' + j,
            row_num: i,
            col_num: j,
            mine: 0,
            status: 'unknown',  // 'unknown', 'opened', 'flag', 'maybe'
        }
    }
}

function actions(row_num, col_num, type) {
    let mine_status = minefield[row_num][col_num].status;
    if (type === 0) {  // 左键
        if (status === 'ready' && mine_status !== 'flag') {
            init_mines(row_num, col_num);
            open(row_num, col_num);
            status = 'playing';
        }
        else if (status === 'playing') {
            if (mine_status === 'unknown' || mine_status === 'maybe') {
                return open(row_num, col_num);
            }
            else if (mine_status === 'opened' && minefield[row_num][col_num].mine > 0) {
                return open_near(row_num, col_num);
            }
        }
    }
    else if (window.event.button === 2) {  // 右键
        if (status === 'ready' || status === 'playing') {
            if (mine_status === 'unknown' || mine_status === 'flag' || mine_status === 'maybe') {
                return flag(row_num, col_num);
            }
        }
    }

}

function init_mines(row_num, col_num) {
    for (let i = 0; i < mines_num; i++) {
        while (true) {
            let target_num = Math.floor(Math.random() * minefield_height * minefield_width);
            let target_y = Math.floor(target_num / minefield_width);
            let target_x = target_num % minefield_width;
            let target = minefield[target_y][target_x];
            if (target.mine !== -1 && target_x !== col_num && target_y !== row_num) {
                target.mine = -1;
                minefield[target_y+1][target_x].mine += 1;
                minefield[target_y-1][target_x].mine += 1;
                minefield[target_y][target_x+1].mine += 1;
                minefield[target_y][target_x-1].mine += 1;
                minefield[target_y+1][target_x+1].mine += 1;
                minefield[target_y-1][target_x-1].mine += 1;
                minefield[target_y+1][target_x+1].mine += 1;
                minefield[target_y-1][target_x-1].mine += 1;
                break;
            }
        }
    }
    $('div.menu-bottom button').removeAttr('disabled');
    return open(row_num, col_num);
}

function flag(row_num, col_num) {
    let target = minefield[row_num][col_num];
    if (target.status === 'unknown') {
        target.status = 'flag';
    }
    else if (target.status === 'flag') {
        target.status = 'maybe';
    }
    else if (target.status === 'maybe') {
        target.status = 'unknown';
    }
    return refresh_minefield();
}

function open(row_num, col_num) {
    let target = minefield[row_num][col_num];
    if (target.status === 'opened') {
        return;
    }
    target.status = 'opened';
    if (target.mine === -1) {
        return die(row_num, col_num);
    }
    if (target.mine === 0) {
        return open_near(row_num, col_num);
    }
    return refresh_minefield();
}

function open_near(row_num, col_num) {
    let flags_count = 0;
    let target = minefield[target_y][target_x];
    flags_count += minefield[target_y][target_x+1].status === 'flag' ? 1 : 0;
    flags_count += minefield[target_y][target_x-1].status === 'flag' ? 1 : 0;
    flags_count += minefield[target_y+1][target_x].status === 'flag' ? 1 : 0;
    flags_count += minefield[target_y+1][target_x+1].status === 'flag' ? 1 : 0;
    flags_count += minefield[target_y+1][target_x-1].status === 'flag' ? 1 : 0;
    flags_count += minefield[target_y-1][target_x].status === 'flag' ? 1 : 0;
    flags_count += minefield[target_y-1][target_x+1].status === 'flag' ? 1 : 0;
    flags_count += minefield[target_y-1][target_x-1].status === 'flag' ? 1 : 0;
    if (flags_count === target.mine || target.mine === 0) {
        open(row_num, col_num + 1);
        open(row_num, col_num - 1);
        open(row_num + 1, col_num);
        open(row_num + 1, col_num + 1);
        open(row_num + 1, col_num - 1);
        open(row_num - 1, col_num);
        open(row_num - 1, col_num + 1);
        open(row_num - 1, col_num - 1);
    }
    return refresh_minefield();
}

function refresh_minefield() {

}


function pause() {
    $('#minefield').toggleClass('pause');
}

function die(row_num, col_num) {
    $('#minefield').addClass('die');
}