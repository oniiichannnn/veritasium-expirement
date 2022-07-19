const simulations =  5000;
const method = "METHOD 1" // there are 2 methods, "METHOD 1" is the random method and "METHOD 2" is the veritasium suggested method with a rate of 0.31% according to the video

let success = 0;
let total_found_prisoners = 0;

loop(start_simulation, simulations)


function start_simulation (i) {
 const numbers = [];
 const boxes = [];

 let found_number_prisoners = 0;

 // generate 100 numbes and push em into a list
 loop(function (i) { numbers.push(i) }, 100);

 // generate the boxes
 let generated_contents = [];
 loop(function (i) {
	// "i" is the current index of the loop
	const label = i;
	 
	// the content of the box is randomly picked from the numbers list
	const filtered_contents = numbers.filter(n => !generated_contents.includes(n));
	 
	// to prevent duplicated contents
	const content = filtered_contents[Math.floor(Math.random() * filtered_contents.length)];
	
	 generated_contents.push(content)
	boxes.push({ label, content });
 }, 100)

 // the prisoners open boxes
 loop(function (i) {
	const prisoner = i;
	const opened_boxes = [];

	let previous_box_content

	loop(function () {
		const filtered_boxes = boxes.filter(box => !opened_boxes.includes(box));
		let chosen_box;

		switch (method) {
			// method 1 = the random method where prisoners randomly choose boxes and open them to see if they get their number
			case "METHOD 1": {
				chosen_box = filtered_boxes[Math.floor(Math.random() * filtered_boxes.length)]
			} break;

			// method 2 = the method where the prisoner will choose a box, open it and pick another box based on the content of the previous box, the method which veritasium said to have a success rate of 0.31%
			case "METHOD 2": {
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
	success++ ; console.log(`Simulation: ${i + 1} Result: SUCCESS Found: ${found_number_prisoners}`)
 } else return console.log(`Simulation: ${i + 1} Result: FAILED Found: ${found_number_prisoners}`)
}

function loop (callback, times) {
  for (let i = 0 ; i < times ; i++) {
    	const result = callback(i);

	if (result === "break") break
  }
}

console.log(`Success: ${success} ; Fails: ${simulations - success} ; Total Found: ${total_found_prisoners}/${100 * simulations} ; AVG Found: ${total_found_prisoners / simulations}`)
