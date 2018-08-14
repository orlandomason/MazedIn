function runMazedInExample() {

	let canvas = document.getElementById('mazedin_example');
	let ctx = canvas.getContext("2d");

	const tile_size = 1;
	const t = tile_size;

	let width = Math.floor(canvas.width / tile_size);
	let height = Math.floor(canvas.height / tile_size);
	let tiles = [];

	// mazedin_form declared in form script
	let background_color = "#" + mazedin_form["mazedin_background_color"].value;
	let letter_fill_color = "#" + mazedin_form["mazedin_letter_fill"].value; 
	background_color = background_color.toLowerCase();
	letter_fill_color = letter_fill_color.toLowerCase();

	const font_text = mazedin_form["mazedin_text"].value;
	const font_size = Number(mazedin_form["mazedin_font_size"].value);

	// Verdana, Bookman, Palatino, Helvetica
	ctx.font = font_size + "px " + mazedin_form["mazedin_font"].value;

	const font_width = Math.ceil(ctx.measureText(font_text).width);
	const font_x = 65;
	const font_y = 70;
	//const font_x = (width - font_width) / 2 - 10;
	//const font_y = (height - font_size) / 2 - 9;

	const sx = Math.floor(font_x / t);
	const sy = Math.floor(font_y / t);
	const wx = sx + font_width;
	const wy = sy + font_size;


	// Start
	for (let x = 0; x < width; x++) {
		tiles[x] = [];
		for(let y = 0; y < height; y++) {
			tiles[x][y] = true;
		}
	}

	function falseTiles() {
		const imageData = ctx.getImageData(font_x, font_y, font_width, font_size);
		let r, g, b, a;

		for (let x = 0; x < font_width; x++) {
			for(let y = 0; y < font_size; y++) {

				let i = (x + y * font_width) * 4;
			    r = imageData.data[i];
			    g = imageData.data[i+1];
			    b = imageData.data[i+2];
			    a = imageData.data[i+3];

			    let rgb = rgbToHex(r, g, b);

			    if(rgb == "#ffffff") {

			    	let a = Math.floor((x + font_x) / t);
			    	let b =  Math.floor((y + font_y) / t);     
			        tiles[a][b] = false;
			    }
			}
		}
		coverTiles2(0, 0);
	}

	function assignTiles() {
		const imageData = ctx.getImageData(font_x, font_y, font_width, font_size);
		let r, g, b, a;

		for (let x = 0; x < font_width; x++) {
			for (let y = 0; y < font_size; y++) {

				let i = (x + y * font_width) * 4;
			    r = imageData.data[i];
			    g = imageData.data[i+1];
			    b = imageData.data[i+2];
			    a = imageData.data[i+3];

			    let rgb = rgbToHex(r, g, b);

			    if (tiles[x + font_x][y + font_y] === true && rgb !== background_color) {
			    	tiles[x + font_x][y + font_y] = rgb;
			    }
			}
		}
	}
	
	// False tiles
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, width, height);

	ctx.fillStyle = "#ffffff";
	ctx.fillText(font_text, font_x, font_size + font_y);

	falseTiles();

	ctx.fillStyle = letter_fill_color;
	ctx.fillRect(0, 0, width, height);

	ctx.fillStyle = background_color;
	ctx.fillText(font_text, font_x, font_size + font_y);

	assignTiles();

	for (let x = 0; x < width; x++) {
		for(let y = 0; y < height; y++) {
			if (tiles[x][y] == 3) {
				tiles[x][y] == true;
			}
		}
	}

	/* Order of events
		
		All tiles[x][y] = true;

		Draw text, find tiles on that text and set them equal to false.

		Set all tiles outside of text equal to 3

		check the 

		Wipe text off canvas.

		findLetterHoles() will set all tiles outside of the false (text) tiles equal to 1,
		the remaining true tiles are the letter holes.

		Build Mazes
	*/
	ctx.clearRect(0, 0, width * tile_size, height * tile_size);

	teso();
	

	function teso() {
		findLetterHoles("black");
		
		buildMaze(1, 1, "#000", 10, 0);
		buildMaze(width-2, 1, "#000", 10, 0);
		buildMaze(1, height-2, "#000", 10, 0);
		buildMaze(width-2, height-2, "#000", 10, 0);

		/*
		buildMaze(1, 1, "#000", 10, 0);
		buildMaze(width - 1, 1, "#000", 10, 0);
		buildMaze(1, height - 1, "#000", 10, 0);
		buildMaze(width - 1, height - 1, "#000", 10, 0);*/
		
		/*
		buildMaze(1, 1, "blue", 10, 0);
		buildMaze(2, 1, "red", 10, 1000);
		buildMaze(1, 2, "yellow", 10, 2000);
		buildMaze(2, 2, "green", 10, 3000);*/

		ctx.fillStyle = background_color;
		ctx.fillRect(0, 0, width, height);
	}


	function buildMaze(x, y, color = "#000", speed = 10, delay = 0) {

		let mapped = [{x, y}];
		tiles[x][y] = false;

		if (delay) setTimeout(mazeSection, delay);
		else mazeSection();

		function mazeSection() {

			ctx.fillStyle = color;

			let l = mapped.length;
			if (!l) return;

			for (let i = l - 1; i >= 0; i -= 4) {
				x = mapped[i].x;
				y = mapped[i].y;

				let direction = findDirection(x, y);
				if (direction) {
					mapped.push(direction);
				}
				else {
					mapped.splice(i, 1);
				}
			}
			setTimeout(mazeSection, speed);
		}
	}

	function findDirection(x, y) {

		let arr = [];
		if (x < width - 2 && tiles[x+2][y]) arr.push(1);
		if (y < height - 2 && tiles[x][y+2]) arr.push(2);
		if (x > 1 && tiles[x-2][y]) arr.push(3);
		if (y > 1 && tiles[x][y-2]) arr.push(4);

		if (!arr.length) return false;

		switch (arr[Math.floor(Math.random() * arr.length)]) {
			case 1:
			    tiles[x+1][y], tiles[x+2][y] = false;
			    ctx.fillRect((x+1) * t, y * t, t, t);
			    ctx.fillRect((x+2) * t, y * t, t, t);
			    x+=2;
				break;
			case 2:
				tiles[x][y+1], tiles[x][y+2] = false;
				ctx.fillRect(x * t, (y+1) * t, t, t);
			    ctx.fillRect(x * t, (y+2) * t, t, t);
				y+=2;
				break;
			case 3:
				tiles[x-1][y], tiles[x-2][y] = false;
				ctx.fillRect((x-1) * t, y * t, t, t);
			    ctx.fillRect((x-2) * t, y * t, t, t);
				x-=2;
				break;
			case 4:
				tiles[x][y-1], tiles[x][y-2] = false;
				ctx.fillRect(x * t, (y-1) * t, t, t);
			    ctx.fillRect(x * t, (y-2) * t, t, t);
				y-=2;
				break;
			default:
				return false;
		}

		if (x > sx && x < wx && y > sy && y < wy) {
			let a = getRandomInt(sx, wx);
			let b = getRandomInt(sy, wy);
			if (tiles[a][b].length == 7) {
				coverTiles(a, b, letter_fill_color);
				//buildMaze(a, b);
			}
		}

		return {x, y};
	}


	function findLetterHoles(color) {

		let x = sx;
		let y = sy;
		let mapped = [{x, y}];
		tiles[x][y] = 1;

		ctx.fillStyle = color;

		mazeSection();

		function mazeSection() {

			let l = mapped.length;
			if (!l) return;

			for (let i = l - 1; i >= 0; i -= 4) {
				x = mapped[i].x;
				y = mapped[i].y;

				let direction = findAdjacentTile(x, y);
				if (direction) {
					mapped.push(direction);
				}
				else {
					mapped.splice(i, 1);
				}
			}

			mazeSection();
		}
	}

	function findAdjacentTile(x, y) {

		let arr = [];
		if (x < width - 1 && tiles[x+1][y] === true) arr.push(1);
		if (y < height - 1 && tiles[x][y+1] === true) arr.push(2);
		if (x >= sx && tiles[x-1][y] === true) arr.push(3);
		if (y >= sy && tiles[x][y-1] === true) arr.push(4);

		if (!arr.length) return false;

		switch (arr[0]) {
			case 1:
			    //ctx.fillRect((x+1) * t, y * t, t, t);
			    x+=1;
				break;
			case 2:
				//ctx.fillRect(x * t, (y+1) * t, t, t);
				y+=1;
				break;
			case 3:
				//ctx.fillRect((x-1) * t, y * t, t, t);
				x-=1;
				break;
			case 4:
				//ctx.fillRect(x * t, (y-1) * t, t, t);
				y-=1;
				break;
			default:
				return false;
		}
		tiles[x][y] = 1;
		return {x, y};
	}

	function coverTiles(x, y, color) {

		let mapped = [{x, y}];
		let count = 0;
		tiles[x][y] = false;
		ctx.fillStyle = color;
		ctx.fillRect(x * t, y * t, t, t);

		mazeSection();

		function mazeSection() {

			ctx.fillStyle = color;

			if (count < 0) return;

			for (let i = count; i >= 0; i -= 4) {
				x = mapped[i].x;
				y = mapped[i].y;

				let direction = fillAdjacentTile(x, y);
				if (direction) {
					mapped.push(direction);
					count++;
				}
				else {
					mapped.splice(i, 1);
					count--;
				}
			}

			setTimeout(mazeSection, 10);
		}
	}

	function coverTiles2(x, y) {

		let mapped = [{x, y}];
		let count = 0;
		tiles[x][y] = false;

		mazeSection();

		function mazeSection() {

			if (count < 0) return;

			for (let i = count; i >= 0; i -= 4) {
				x = mapped[i].x;
				y = mapped[i].y;

				let direction = fillAdjacentTile2(x, y);
				if (direction) {
					mapped.push(direction);
					count++;
				}
				else {
					mapped.splice(i, 1);
					count--;
				}
			}

			mazeSection();
		}
	}

	function fillAdjacentTile2(x, y) {

		let arr = [];
		if (x < width - 1 && tiles[x+1][y] === true) arr.push(1);
		if (y < height - 1 && tiles[x][y+1] === true) arr.push(2);
		if (x > 0 && tiles[x-1][y] === true) arr.push(3);
		if (y > 0 && tiles[x][y-1] === true) arr.push(4);

		if (!arr.length) return false;

		switch (arr[0]) {
			case 1:
				x+=1;
				break;
			case 2:
				y+=1;
				break;
			case 3:
				x-=1;
				break;
			case 4:
				y-=1;
				break;
			default:
				return false;
		}
		tiles[x][y] = 3;
		return {x, y};
	}

	function fillAdjacentTile(x, y) {

		let arr = [];
		if (x < width - 1 && tiles[x+1][y]) arr.push(1);
		if (y < height - 1 && tiles[x][y+1]) arr.push(2);
		if (x > 0 && tiles[x-1][y]) arr.push(3);
		if (y > 0 && tiles[x][y-1]) arr.push(4);

		if (!arr.length) return false;

		switch (arr[0]) {
			case 1:
				x+=1;
				ctx.fillStyle = tiles[x][y];
			    ctx.fillRect(x * t, y * t, t, t);
				break;
			case 2:
				y+=1;
				ctx.fillStyle = tiles[x][y];
				ctx.fillRect(x * t, y * t, t, t);
				break;
			case 3:
				x-=1;
				ctx.fillStyle = tiles[x][y];
				ctx.fillRect(x * t, y * t, t, t);
				break;
			case 4:
				y-=1;
				ctx.fillStyle = tiles[x][y];
				ctx.fillRect(x * t, y * t, t, t);
				break;
			default:
				return false;
		}
		tiles[x][y] = false;
		return {x, y};
	}
}

// Maths
function getRandomInt(min, max) {
    let mn = Math.ceil(min);
    let mx = Math.floor(max);
    return Math.floor(Math.random() * (mx - mn + 1)) + mn;
    // min and max inclusive
}

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}