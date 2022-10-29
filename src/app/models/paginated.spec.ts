import { UIPagination } from "./paginated";

describe('UIPagination', () => {
    let tbcObject: UIPagination;
    beforeEach(() => {
        tbcObject = new UIPagination(10, 2);
    });

    it('work with data', () => {
        tbcObject.totalCount = 20;
        expect(tbcObject.totalCount).toEqual(20);

        expect(tbcObject.currentPage).toEqual(0);
        expect(tbcObject.isFirstVisible).toBeFalse();
        expect(tbcObject.isLastVisible).toBeFalse();
        expect(tbcObject.isPreviousVisible).toBeFalse();
        expect(tbcObject.isNextVisible).toBeFalse();
        expect(tbcObject.nextURLString).toBeFalsy();

        tbcObject.currentPage = 1;
        expect(tbcObject.currentPage).toEqual(1);
        expect(tbcObject.isFirstVisible).toBeFalse();
        expect(tbcObject.isLastVisible).toBeTrue();
        expect(tbcObject.isPreviousVisible).toBeFalse();
        expect(tbcObject.isNextVisible).toBeTrue();
        expect(tbcObject.previousURLString).toBeFalsy();
        expect(tbcObject.nextURLString).toBeTruthy();
        expect(tbcObject.nextURLParameters).toBeTruthy();

        tbcObject.totalCount = 0;
    });

    it('work with data II', () => {
        tbcObject.totalCount = 50;
        tbcObject.currentPage = 2;
        expect(tbcObject.isPreviousVisible).toBeTruthy();
        expect(tbcObject.previousURLString).toBeTruthy();
        expect(tbcObject.previousURLParameters).toBeTruthy();
    });
});
