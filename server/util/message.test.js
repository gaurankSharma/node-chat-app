let expect = require("expect");
let { generateMessage } = require("./message");

describe("generateMessage", () => {
    it("shout return to value ", () => {
        let from = "gaurank";
        let text = "message fot client";
        let message = generateMessage(from, text);
        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({ from, text });

    })
})