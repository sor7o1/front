import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalService {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}
  setItem(key: string, value: any): void {
    isPlatformBrowser(this.platformId)
      ? window["localStorage"].setItem(key, JSON.stringify(value))
      : undefined;
  }

  getItem(key: string): any {
    const item = isPlatformBrowser(this.platformId)
      ? window["localStorage"].getItem(key)
      : undefined;

    return item ? JSON.parse(item) : null;
  }

  removeItem(key: string): void {
    isPlatformBrowser(this.platformId)
      ? window["localStorage"].removeItem(key)
      : undefined;
  }

  clear(): void {
    isPlatformBrowser(this.platformId)
      ? window["localStorage"].clear()
      : undefined;
  }
}
