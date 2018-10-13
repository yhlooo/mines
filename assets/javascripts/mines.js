let minefield_width = 30;
let minefield_height = 16;
let mines_num = 99;

let minefield = Array();
for (let i = 0; i < minefield_height; i++) {
    minefield[i] = Array();
    for (let j = 0; j < minefield_width; j++) {
        minefield[i][j] = {
            id: 'cell' + i + '-' + j,
            row_num: i,
            col_num: j,
        }
    }
}


function actions() {

}

function init_mines() {
    for (let i = 0; i < mines_num; i++) {
        while (true) {
            let target_num = Math.floor(Math.random() * minefield_height * minefield_width);
            let target_y = Math.floor(target_num / minefield_width);
            let target_x = target_num % minefield_width;
            let target = $('#cell' + target_y + '-' + target_x);
            if (!target.hasClass('active')) {
                console.log(target_x, target_y);
                target.addClass('active');
                break;
            }
        }
    }
}

