import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { PhotoService } from '../services';
import { TagCount } from '../model';
import { ReplaySubject } from 'rxjs';
declare var echarts: any;

@Component({
  selector: 'acgallery-tag-cloud',
  templateUrl: './tag-cloud.component.html',
  styleUrls: ['./tag-cloud.component.scss'],
})
export class TagCloudComponent implements OnInit, AfterViewInit {
  private _destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  tagTerm: string;
  @ViewChild('tagcloud') tagcloud: ElementRef;

  constructor(private _photoService: PhotoService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._photoService.getTagCount().subscribe((x: any) => {
      let dataCloud: any[] = [];
      for (let s1 of x) {
        let s2: TagCount = <TagCount>s1;

        let cd: any = {
          name: s2.tagString,
          value: s2.count,
        };
        dataCloud.push(cd);
      }

      let chart: any = echarts.init(this.tagcloud.nativeElement);
      let option: any = {
        tooltip: {},
        series: [{
          type: 'wordCloud',
          gridSize: 2,
          sizeRange: [12, 50],
          rotationRange: [-90, 90],
          shape: 'pentagon',
          width: 600,
          height: 400,
          drawOutOfBound: true,
          textStyle: {
            normal: {
              color: () => {
                return 'rgb(' + [
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                ].join(',') + ')';
              },
            },
            emphasis: {
              shadowBlur: 10,
              shadowColor: '#333',
            },
          },
          data: dataCloud,
        }],
      };
      chart.setOption(option);
      });
  }
}
