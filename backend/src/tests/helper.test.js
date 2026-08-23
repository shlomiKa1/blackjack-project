import { describe, test, it, mock } from "node:test";
import assert from "assert/strict";
import { newRound, insureNewCard, sumNumberCard } from "../utils/helper.js";

// xport const VALUE_CARDS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
// export const TYPE_CARDS = ["♠", "♥", "♦", "♣"];

test("Testing function sumNumberCard", () => {
  describe("sumNumberCard - without Ace", () => {
    it("Should sum regelore cards", () => {
      assert.equal(sumNumberCard([{ rank: "5" }, { rank: "6" }]), 11);
    });

    it("Should sum J/Q/K to 10 for any each", () => {
      assert.equal(sumNumberCard([{ rank: "J" }, { rank: "9" }]), 19);
    });
  });

  describe("SumNumberCard - one Ace", () => {
    it("A+9 = 20 (Ace is 11)", () => {
      assert.equal(sumNumberCard([{ rank: "A" }, { rank: "9" }]), 20);
    });

    it("A+5+8 = 14 (Ace go down to 1)", () => {
      assert.equal(
        sumNumberCard([{ rank: "A" }, { rank: "5" }, { rank: "8" }]),
        14,
      );
    });
  });

  describe("sumNumberCard - At least Two Ace", () => {
    it("A+A+9 = 21 (One Ace is 11 and anouther is 1)", () => {
      assert.equal(
        sumNumberCard([{ rank: "A" }, { rank: "A" }, { rank: "9" }]),
        21,
      );
    });

    it("A+A+A+8 = 21", () => {
      assert.equal(
        sumNumberCard([
          { rank: "A" },
          { rank: "A" },
          { rank: "A" },
          { rank: "8" },
        ]),
        21,
      );
    });

    it("A + A + 10 = 12 (The Two Ace have to be 1)", () => {
      assert.equal(
        sumNumberCard([{ rank: "A" }, { rank: "A" }, { rank: "10" }]),
        12,
      );
    });
  });
});

test("Testing - insureNewCard function", () => {
  describe("insureNewCard - Normal situation ", () => {
    it("Should return true, that we return rank & suit", () => {
      const card = insureNewCard([], []);
      assert.ok(card.rank);
      assert.ok(card.suit);
    });
  });

  describe("insureNewCard - caplicate cards", () => {
    it("That to first card already exists", () => {
      const sequence = [0, 0, 0.5, 0.5];
      let i = 0;
      const randomMock = mock.method(Math, "random", () => sequence[i++]);

      const existingCard = { rank: "2", suit: "S" };
      const result = insureNewCard([existingCard], []);

      randomMock.mock.restore();

      assert.deepEqual(result, { rank: "8", suit: "D" });
      assert.equal(i, 4, "that should return new cards");
    });
  });
});
