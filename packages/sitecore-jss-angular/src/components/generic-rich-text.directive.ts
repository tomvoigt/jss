import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { isAbsoluteUrl } from '@sitecore-jss/sitecore-jss';
import { RichTextField } from './rendering-field';

@Directive({
  selector: '[scGenericRichText]',
})
export class GenericRichTextDirective implements OnChanges {
  @Input('scGenericRichTextEditable')
  editable = true;

  @Input('scGenericRichText')
  field: RichTextField;

  private viewRef: EmbeddedViewRef<HTMLElement>;

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    // eslint-disable-next-line dot-notation
    if (changes['field'] || changes['editable']) {
      if (!this.viewRef) {
        this.viewContainer.clear();
        this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
      }

      this.updateView();
    }
  }

  private updateView() {
    const field = this.field;
    if (!field || (!field.editable && !field.value)) {
      return;
    }

    const html = field.editable && this.editable ? field.editable : field.value;
    this.viewRef.rootNodes.forEach((node) => {
      node.innerHTML = html;
      // eslint-disable-next-line eqeqeq
      if (node.querySelectorAll != null) {
        const links: NodeListOf<HTMLLinkElement> = node.querySelectorAll('a[href]');
        const linksArray: Array<HTMLLinkElement> = [].slice.call(links);

        linksArray.forEach((link) => {
          const href = link.getAttribute('href');
          const target = link.getAttribute('target');

          // eslint-disable-next-line eqeqeq
          if (href != null && !isAbsoluteUrl(href) && target !== '_blank' && target !== '_top') {
            this.renderer.listen(link, 'click', (event) => {
              this.router.navigateByUrl(href);
              event.preventDefault();
            });
          }
        });
      }
    });
  }
}
