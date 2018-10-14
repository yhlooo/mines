let minefield_width = get_url_param('width') === null ? 30 : parseInt(get_url_param('width'));
let minefield_height = get_url_param('height') === null ? 16 : parseInt(get_url_param('height'));
let mines_num = get_url_param('mines') === null ? 99 : parseInt(get_url_param('mines'));
let flags_num = 0;
let begin_time = 0;
let store_time = 0;
let opened_num = 0;
let status = 'ready';  // 'ready', 'playing', 'die', 'win' or 'pause'

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
            status = 'playing';
            init_mines(row_num, col_num);
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
        if (status === 'playing') {
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
            if (target.mine !== -1) {
                let x_plus = col_num + 1 < minefield_width;
                let x_sub = col_num > 0;
                let y_plus = row_num + 1 < minefield_height;
                let y_sub = row_num > 0;
                if (row_num === target_y && col_num === target_x) { continue; }
                if (x_plus && row_num === target_y && col_num + 1 === target_x) { continue; }
                if (x_sub && row_num === target_y && col_num - 1 === target_x) { continue; }
                if (y_plus &&  row_num + 1 === target_y && col_num === target_x) { continue; }
                if (y_plus && x_plus && row_num + 1 === target_y && col_num + 1 === target_x) { continue; }
                if (y_plus && x_sub && row_num + 1 === target_y && col_num - 1 === target_x) { continue; }
                if (y_sub && row_num - 1 === target_y && col_num === target_x) { continue; }
                if (y_sub && x_plus && row_num - 1 === target_y && col_num + 1 === target_x) { continue; }
                if (y_sub && x_sub && row_num - 1 === target_y && col_num - 1 === target_x) { continue; }

                target.mine = -1;
                x_plus = target_x + 1 < minefield_width;
                x_sub = target_x > 0;
                y_plus = target_y + 1 < minefield_height;
                y_sub = target_y > 0;
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
    begin_time = (new Date()).getTime();
    refresh_timer();
    return open(row_num, col_num);
}

function flag(row_num, col_num) {
    let target = minefield[row_num][col_num];
    if (target.status === 'unknown') {
        if (flags_num < mines_num) {
            flags_num += 1;
            target.status = 'flag';
        }
        else
            target.status = 'maybe';
    }
    else if (target.status === 'flag') {
        flags_num -= 1;
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
    opened_num += 1;
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
    if (status === 'win')
        return;
    $('#mines_num').text(mines_num);
    $('#flags_num').text(flags_num);
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
    if (is_win()) {
        status = 'win';
        refresh_timer(true);
        win();
    }
}

function start_over() {
    pause();
    $('#dialog-btn0').attr('onclick', '$(\'#main-dialog\').hide();pause();');
    $('#dialog-btn1').attr('onclick', 'location.reload()');
    $('#main-dialog').show();
}
function pause() {
    if (status === 'pause') {
        status = 'playing';
        refresh_timer();
        $('#minefield').attr('class', 'playing');
    }
    else if (status === 'playing') {
        status = 'pause';
        refresh_timer(true);
        $('#minefield').attr('class', 'pause');
    }
}
function change_diff() {
    if (status === 'playing') {
        pause();
        $('#dialog-btn0').attr('onclick', '$("#main-dialog").hide();pause();');
        $('#dialog-btn1').attr('onclick', 'location.href = "./difficulty.html"');
        $('#main-dialog').show();
    }
    else
        location.href = './difficulty.html';
}

function win() {
    let min = Math.floor(store_time / 60000);
    let sec = Math.floor(store_time % 60000 / 1000);
    alert('太强了，你完成了！只用了' + min + '分' + sec + '秒！\n由于排行榜还在开发中，所以目前你只能自己记着啦😊...');
    location.href = './difficulty.html';
}
function die() {
    status = 'die';
    refresh_timer();
    $('#menu-btn0')
        .text('Play Again')
        .attr('onclick', 'location.reload()');
    $('#menu-btn1')
        .text('Best Times')
        .attr('onclick', 'alert("排行榜功能还在开发中...")');
        // .attr('onclick', 'location.href = "./rankings.html"');
    $('#menu-btn2')
        .text('Change Difficulty')
        .attr('onclick', 'change_diff()');
    refresh_minefield();
}

function refresh_timer(lock) {
    if (status === 'playing' && !lock) {
        if (store_time !== 0) {
            begin_time = (new Date).getTime() - store_time;
            store_time = 0;
        }
        let time = (new Date()).getTime() - begin_time + store_time;
        let min = Math.floor(time / 60000);
        let sec = Math.floor(time % 60000 / 1000);
        if (sec < 10)
            sec = '0' + sec;
        if (min < 10)
            min = '0' + min;
        $('#timer').text(min.toString() + ':' + sec.toString());
        setTimeout(refresh_timer, 200);
    }
    else {
        store_time = (new Date()).getTime() - begin_time;
    }
}

function is_win() {
    return opened_num === minefield_height * minefield_width - mines_num;
}

function get_url_param(key) {
    let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");  //构造一个含有目标参数的正则表达式对象
    let r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null)
        return decodeURI(r[2]);
    return null;  //返回参数值
}
function setCookie(c_name, value) {
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + 3650);  // 十年有效
    document.cookie = c_name + "=" + escape(value) + ((36500==null) ? "" : ";expires=" + exdate.toGMTString());
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start !== -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end === -1)
                c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}
