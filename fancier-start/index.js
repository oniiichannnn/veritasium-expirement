const clc = require("cli-color");
const cp = require("node:child_process");

const args = process.argv.filter((a, i) => i > 1)
const simulations = args[0] || 5000;
const method = args[1]

if (!args[1]) {
 cp.spawn(`node index.js ${simulations} METHOD_1`, [], {shell: true, detached: true});
 cp.spawn(`node index.js ${simulations} METHOD_2`, [], {shell: true, detached: true});

 return
}

let success = 0;
let total_found_prisoners = 0;

loop(start_simulation, simulations)


function start_simulation (i) {
 const numbers = [];
 const boxes = [];

 let found_number_prisoners = 0;

 loop(function (i) { numbers.push(i) }, 100);

 let generated_contents = [];
 loop(function (i) {
	const label = i;
	const filtered_contents = numbers.filter(n => !generated_contents.includes(n));
	const content = filtered_contents[Math.floor(Math.random() * filtered_contents.length)];
	
	generated_contents.push(content);
	boxes.push({ label, content });
 }, 100)

 loop(function (i) {
	const prisoner = i;
	const opened_boxes = [];

	let previous_box_content

	loop(function () {
		const filtered_boxes = boxes.filter(box => !opened_boxes.includes(box));
		let chosen_box;

		switch (method) {
			case "METHOD_1": {
				chosen_box = filtered_boxes[Math.floor(Math.random() * filtered_boxes.length)]
			} break;

			case "METHOD_2": {
				chosen_box = function () {
					if (previous_box_content !== undefined) {
						if (opened_boxes.find(box => box.label === previous_box_content)) {
					
							previous_box_content = undefined;
							return filtered_boxes[Math.floor(Math.random() * filtered_boxes.length)]
						
						} else return filtered_boxes.find(box => box.label === previous_box_content)
					} else return filtered_boxes[Math.floor(Math.random() * filtered_boxes.length)]
				}();
			} break;
		}

		previous_box_content = chosen_box.content;

		opened_boxes.push(chosen_box)

		if (chosen_box.content === prisoner) { found_number_prisoners++ ; return "break" }
	}, 50)
 }, 100)

 total_found_prisoners += found_number_prisoners;

 if (found_number_prisoners === 100) {
	success++ ; console.log(`Simulation: ${i + 1} Result: ${clc.black.bgGreen("[SUCCESS]")} Found: ${found_number_prisoners}`)
 } else return console.log(`Simulation: ${i + 1} Result: ${clc.black.bgRed("[FAILED]")} Found: ${found_number_prisoners}`)
}

function loop (callback, times) {
  for (let i = 0 ; i < times ; i++) {
    	const result = callback(i);

	if (result === "break") break
  }
}

console.log(`Success: ${success} ; Fails: ${simulations - success} ; Total Found: ${total_found_prisoners}/${100 * simulations} ; AVG Found: ${total_found_prisoners / simulations}`)
console.log(`\n\nPress ${clc.black.bgWhite("ENTER")} to close`)

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  if (key.name === 'return') {
    process.exit();
  }
});