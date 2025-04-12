// Import the functions directly from the source file
import {
  createLongLivingCookieOptions,
  generateRandomIDDocumentNumber,
  getRandomElement,
  isValidUUIDv4,
} from "@/lib/utils";

describe("Utils Functions", () => {
  describe("createLongLivingCookieOptions", () => {
    it("should create cookie options with correct properties", () => {
      const name = "test-cookie";
      const value = "test-value";

      const result = createLongLivingCookieOptions(name, value);

      expect(result).toEqual({
        name,
        value,
        path: "/",
        maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
    });

    it("should set secure to false in test environment", () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "test";

      const result = createLongLivingCookieOptions("name", "value");

      expect(result.secure).toBe(false);

      process.env.NODE_ENV = originalNodeEnv;
    });

    it("should set secure to true in production environment", () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      const result = createLongLivingCookieOptions("name", "value");

      expect(result.secure).toBe(true);

      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe("isValidUUIDv4", () => {
    it("should return true for valid UUIDv4 strings", () => {
      const validUUIDs = [
        "123e4567-e89b-42d3-a456-426614174000",
        "c73bcdcc-2669-4bf6-81d3-e4ae73fb11fd",
        "507f191e-1111-4d3b-ab7e-c07c0a4c7d04",
      ];

      validUUIDs.forEach((uuid) => {
        expect(isValidUUIDv4(uuid)).toBe(true);
      });
    });

    it("should return false for invalid UUIDv4 strings", () => {
      const invalidUUIDs = [
        "", // empty string
        "not-a-uuid",
        "123e4567-e89b-12d3-a456-426614174000", // wrong version number (should be 4)
        "123e4567-e89b-42d3-7456-426614174000", // wrong variant (should start with 8-9a-b)
        "123e4567-e89b42d3-a456-426614174000", // missing hyphen
        "123e4567-e89b-42d3-a456-4266141740", // too short
      ];

      invalidUUIDs.forEach((uuid) => {
        expect(isValidUUIDv4(uuid)).toBe(false);
      });
    });
  });

  describe("generateRandomIDDocumentNumber", () => {
    it("should generate a 9-digit number as string", () => {
      const result = generateRandomIDDocumentNumber();

      expect(typeof result).toBe("string");
      expect(result.length).toBe(9);
      expect(/^\d{9}$/.test(result)).toBe(true);
    });

    it("should generate different numbers on consecutive calls", () => {
      const results = new Set();
      for (let i = 0; i < 10; i++) {
        results.add(generateRandomIDDocumentNumber());
      }

      // If all generated numbers are unique, the set size should be 10
      expect(results.size).toBe(10);
    });
  });

  describe("getRandomElement", () => {
    it("should return an element from the provided array", () => {
      const array = ["apple", "banana", "cherry"];
      const result = getRandomElement(array);

      expect(array).toContain(result);
    });

    it("should return undefined for an empty array", () => {
      const result = getRandomElement([]);

      expect(result).toBeUndefined();
    });

    it("should return the only element for a single-element array", () => {
      const array = ["solo"];
      const result = getRandomElement(array);

      expect(result).toBe("solo");
    });
  });
});
