import { FullPageAdsComponent } from './full-page-ads/full-page-ads.component';
import { AdComponent } from './ad/ad.component';
import { LoaderComponent } from './loader/loader.component';
import { EllipsisLoaderComponent } from './ellipsis-loader/ellipsis-loader.component';
import { VideoAdComponent } from './video-ad/video-ad.component';


export * from './ad/ad.component';
export * from './loader/loader.component';
export * from './full-page-ads/full-page-ads.component';
export * from './ellipsis-loader/ellipsis-loader.component';
export * from './video-ad/video-ad.component';

export const components = [
  AdComponent,
  LoaderComponent,
  FullPageAdsComponent,
  EllipsisLoaderComponent,
  VideoAdComponent
];
