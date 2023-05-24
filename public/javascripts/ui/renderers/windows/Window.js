class Window {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.opened = false;
        this.buttonList = [];
    }

    createButton(name, x, y, action, widthCenter, height) {
        let button = createButton(name);
        button.parent('game');
        if (widthCenter) {
            button.size(widthCenter, height);
            button.position(x - widthCenter / 2, y);
        } else button.position(x, y);
        button.mousePressed(action);
        button.addClass('game');
        button.hide();
        this.buttonList.push(button);
    }

    open() {
        this.opened = true;
        for (let button of this.buttonList) {
            button.show();
        }
    }

    close() {
        this.opened = false;
        for (let button of this.buttonList) {
            button.hide();
        }
    }

    draw() {
        if(this.opened){
            rect(this.x, this.y, this.width, this.height);
        }
    }
}