import { describe } from "mocha"
import {expect} from "chai";
import {PathMap} from "../dist/@types/PathMap";


describe('pathMap',()=>{
    const pathMap = new PathMap()
    it('simple path',()=>{
        expect(pathMap.path(""))
    })
})