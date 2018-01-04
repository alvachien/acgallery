
/**
 * UI pagination class
 * Key attributes:
 *  currentPage: get or set current page index
 *  totalCount: get or set total count of records
 *  isFirstVisible: is first page visible
 *  isLastVisible: is last page visible
 *  isNextVisible: is next page visible
 *  isPreviousVisible: is previous page visible
 *  nextAPIString: URL string for getting next page
 *  previousAPIString: URL string for getting previous page
 */
export class UIPagination {
  private _totalItems: number;
  private _currentPage: number;
  private _itemsPerPage: number;
  private _maxVisualPage: number;
  private _totalPages: number;
  public visPags: Array<number>;

  /**
   * Constructor
   * @param itemInPage: Record amount per page
   * @param vispage: Visual pages
   */
  constructor(itemInPage: number = 20, vispage: number = 5) {
    this._itemsPerPage = itemInPage;
    this._maxVisualPage = vispage;

    this._totalItems = 0;
    this._currentPage = 0;
  }

  get currentPage(): number {
    return this._currentPage;
  }
  set currentPage(val: number) {
    if (this._currentPage !== val) {
      this._currentPage = val;

      this.workOut();
    }
  }

  get totalCount(): number {
    return this._totalItems;
  }
  set totalCount(val: number) {
    if (this._totalItems !== val) {
      this._totalItems = val;

      this.workOut();
    }
  }

  get isFirstVisible(): boolean {
    return this.currentPage > 1;
  }
  get isLastVisible(): boolean {
    return this.currentPage < this._totalPages;
  }
  get isNextVisible(): boolean {
    return this.currentPage < this._totalPages;
  }
  get isPreviousVisible(): boolean {
    return this.currentPage > 1;
  }

  get nextURLString(): string {
    if (this._currentPage === 0) {
      return '';
    }

    const skipamt = (this.currentPage - 1) * this._itemsPerPage;
    if (skipamt === 0) {
      return '?top=' + this._itemsPerPage;
    }

    return '?top=' + this._itemsPerPage + '&skip=' + skipamt;
  }

  get nextURLParameters(): Map<string, number> {
    const rst: Map<string, number> = new Map<string, number>();
    if (this._currentPage === 0) {
      return rst;
    }

    rst.set('top', this._itemsPerPage);
    const skipamt = (this.currentPage - 1) * this._itemsPerPage;
    if (skipamt > 0) {
      rst.set('skip', skipamt);
    }

    return rst;
  }

  get previousURLString(): string {
    if (this._totalItems === 0 || this._currentPage < 2) {
      return '';
    }

    const skipamt = (this.currentPage - 2) * this._itemsPerPage;
    if (skipamt === 0) {
      return '?top=' + this._itemsPerPage;
    }

    return '?top=' + this._itemsPerPage + '&skip=' + skipamt;
  }

  get previousURLParameters(): Map<string, number> {
    const rst: Map<string, number> = new Map<string, number>();

    if (this._totalItems === 0 || this._currentPage < 2) {
      return rst;
    }

    rst.set('top', this._itemsPerPage);
    const skipamt = (this.currentPage - 2) * this._itemsPerPage;
    if (skipamt > 0) {
      rst.set('skip', skipamt);
    }
    
    return rst;
  }

  private workOut(): void {
    if (this._totalItems === 0) {
      this._totalPages = 0;

      this.visPags = [];
      return;
    }

    if (this._currentPage === 0) {
      return;
    }

    this._totalPages = Math.ceil(this._totalItems / this._itemsPerPage);
    this.visPags = [];

    let startPage = this.currentPage;
    if (this._totalPages - this.currentPage < this._maxVisualPage) {
      if (this._totalPages < this._maxVisualPage) {
        startPage = 1;
      } else {
        startPage = Math.min(this.currentPage, this._totalPages - this._maxVisualPage + 1);
      }
    }

    for (let idx = startPage; idx <= this._totalPages; idx++) {
      this.visPags.push(idx);
    }
  }
}
