export class Album {
    public Id: number;
    public Title: string;
    public Desp: string;
    public Thumbnail: string;
    public CreatedAt: Date;
    public CreatedBy: string;
    public PhotoCount: number;
    public IsPubic: boolean;
    public AccessCode: string;

    public Photoes: any;

    constructor() {
    }

    init(id: number,
        title: string,
        desp: string,
        thumnail: string,
        dateCreated: Date,
        createdby: string,
        isPublic: boolean,
        accessCode: string,
        photocnt: number) {
        this.Id = id;
        this.Title = title;
        this.Desp = desp;
        this.Thumbnail = thumnail;
        this.CreatedAt = dateCreated;
        this.CreatedBy = createdby;

        this.IsPubic = isPublic;
        this.AccessCode = accessCode;

        this.PhotoCount = photocnt;
    }
}
