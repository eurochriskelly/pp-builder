"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_yaml_1 = __importDefault(require("js-yaml"));
const validate_1 = require("./validate");
const FIXTURES = require('../test/fixtures-test-data');
describe('Valdiation functions work', () => {
    it('should validate the planned fixtures', () => {
        const config = FIXTURES['simple valid yaml'];
        const issues = [];
        const result = (0, validate_1.validateFixtures)(js_yaml_1.default.load(config), issues);
        expect(result).toBe(true);
        expect(issues.length).toBe(0);
    });
    it('should not validate incorrect fixtures', () => {
        const config = js_yaml_1.default.load(FIXTURES['simple invalid yaml']);
        var issues = [];
        const result = (0, validate_1.validateFixtures)(config, issues);
        expect(result).toBe(false);
        expect(issues.length).toBe(1);
    });
    it('should not validate incorrect pitches', () => {
        const config = js_yaml_1.default.load(FIXTURES['bad pitch']);
        var issues = [];
        const result = (0, validate_1.checkPitches)(config, issues);
        expect(result).toBe(false);
        expect(issues.length).toBe(1);
    });
});
