export const randomfood = randomFood()

//return random food :D just for fun
function randomFood(){
    var foods = [
        'Bakso', 'Ayam Goreng', 'Mie Ayam',
        'Rawon',
        'Lontong Balap',
        'Bebek Goreng',
        'Pecel',
        'Rujak Cingur',
        'Tahu Lontong',
        'Tahu Tek',
    ]

    return foods[Math.floor(Math.random() * foods.length)]
}


