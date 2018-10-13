let minefield_width = 30;
let minefield_height = 16;
let mines_num = 99;
let status = 'ready';  // 'ready', 'playing', 'die' or 'pause'

let minefield = [];
for (let i = 0; i < minefield_height; i++) {
    minefield[i] = [];
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
            status = 'playing';
            open(row_num, col_num);
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
                let x_plus = target_x + 1 < minefield_width;
                let x_sub = target_x > 0;
                let y_plus = target_y + 1 < minefield_height;
                let y_sub = target_y > 0;
                if (x_plus && minefield[target_y][target_x+1].mine !== -1) minefield[target_y][target_x+1].mine += 1;
                if (x_sub && minefield[target_y][target_x-1].mine !== -1) minefield[target_y][target_x-1].mine += 1;
                if (y_plus && minefield[target_y+1][target_x].mine !== -1) minefield[target_y+1][target_x].mine += 1;
                if (y_plus && x_plus && minefield[target_y+1][target_x+1].mine !== -1) minefield[target_y+1][target_x+1].mine += 1;
                if (y_plus && x_sub && minefield[target_y+1][target_x-1].mine !== -1) minefield[target_y+1][target_x-1].mine += 1;
                if (y_sub && minefield[target_y-1][target_x].mine !== -1) minefield[target_y-1][target_x].mine += 1;
                if (y_sub && x_plus && minefield[target_y-1][target_x+1].mine !== -1) minefield[target_y-1][target_x+1].mine += 1;
                if (y_sub && x_sub && minefield[target_y-1][target_x-1].mine !== -1) minefield[target_y-1][target_x-1].mine += 1;
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
    if (target.status === 'opened' || target.status === 'flag') {
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
    let target = minefield[row_num][col_num];

    let x_plus = col_num + 1 < minefield_width;
    let x_sub = col_num > 0;
    let y_plus = row_num + 1 < minefield_height;
    let y_sub = row_num > 0;
    if (x_plus) flags_count += minefield[row_num][col_num+1].status === 'flag' ? 1 : 0;
    if (x_sub) flags_count += minefield[row_num][col_num-1].status === 'flag' ? 1 : 0;
    if (y_plus) flags_count += minefield[row_num+1][col_num].status === 'flag' ? 1 : 0;
    if (y_plus && x_plus) flags_count += minefield[row_num+1][col_num+1].status === 'flag' ? 1 : 0;
    if (y_plus && x_sub) flags_count += minefield[row_num+1][col_num-1].status === 'flag' ? 1 : 0;
    if (y_sub) flags_count += minefield[row_num-1][col_num].status === 'flag' ? 1 : 0;
    if (y_sub && x_plus) flags_count += minefield[row_num-1][col_num+1].status === 'flag' ? 1 : 0;
    if (y_sub && x_sub) flags_count += minefield[row_num-1][col_num-1].status === 'flag' ? 1 : 0;

    if (flags_count === target.mine || target.mine === 0) {
        if (x_plus) open(row_num, col_num + 1);
        if (x_sub) open(row_num, col_num - 1);
        if (y_plus) open(row_num + 1, col_num);
        if (y_plus && x_plus) open(row_num + 1, col_num + 1);
        if (y_plus && x_sub) open(row_num + 1, col_num - 1);
        if (y_sub) open(row_num - 1, col_num);
        if (y_sub && x_plus) open(row_num - 1, col_num + 1);
        if (y_sub && x_sub) open(row_num - 1, col_num - 1);
    }
    return refresh_minefield();
}

function refresh_minefield() {
    $('#minefield').attr('class', status);
    for (let i = 0; i < minefield_height; i++) {
        for (let j = 0; j < minefield_width; j++) {
            let cell = $('#cell' + i +  '-' + j);
            let cell_class = [];
            if (minefield[i][j].status === 'opened') {
                if (minefield[i][j].mine > -1)
                    cell_class[cell_class.length] = 'mine' + minefield[i][j].mine;
                else
                    cell_class[cell_class.length] = 'exploded';
                cell_class[cell_class.length] = 'opened';
            }
            else {
                if (status === 'playing') {
                    if (minefield[i][j].status === 'flag' || minefield[i][j].status === 'maybe')
                        cell_class[cell_class.length] = minefield[i][j].status;
                    cell_class[cell_class.length] = 'default';
                }
                else if (status === 'die') {
                    if (minefield[i][j].mine === -1 && minefield[i][j].status !== 'flag')
                        cell_class[cell_class.length] = 'mine';
                    else if (minefield[i][j].mine === -1 && minefield[i][j].status === 'flag')
                        cell_class[cell_class.length] = 'flag';
                    else if (minefield[i][j].mine !== -1 && minefield[i][j].status === 'flag')
                        cell_class[cell_class.length] = 'incorrect';
                    else if (minefield[i][j].status === 'maybe')
                        cell_class[cell_class.length] = 'maybe';
                    cell_class[cell_class.length] = 'die';
                }
            }
            cell.attr('class', cell_class.join(' '));
        }
    }
}


function pause() {
    if (status === 'playing') {
        status = 'pause';
        $('#minefield').attr('class', 'pause');
    }
    else if (status === 'playing') {
        status = 'pause';
        $('#minefield').attr('class', 'pause');
    }
}

function die() {
    status = 'die';
    $('#minefield').attr('class', 'die');
    refresh_minefield();
}