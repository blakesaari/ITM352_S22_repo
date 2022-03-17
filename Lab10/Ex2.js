while(true) {
    if(controller.move() == false) {
    controller.rotate();
    }
await sleep(3000);
}