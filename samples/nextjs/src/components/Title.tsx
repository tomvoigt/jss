import React from 'react';
import {
  RenderingVariants,
  RenderingVariantProps,
  RenderingVariantParameters,
  ComponentRendering,
  Link as JssLink,
  LinkFieldValue,
  Text,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import {
  TextField,
} from '@sitecore-jss/sitecore-jss-react';

interface Fields {
  data: Object & {
    datasource: Object & {
      url: Object & {
        path: string;
        siteName: string;
      };
      field: Object & {
        jsonValue: Object & {
          value: string;
          editable: string;
        }
      };
    };
    contextItem: Object & {
      url: Object & {
        path: string;
        siteName: string;
      };
      field: Object & {
        jsonValue: Object & {
          value: string;
          editable: string;
        }
      };
    };
  };
}

interface ComponentProps {
  rendering: ComponentRendering & { params: RenderingVariantParameters };
  params: RenderingVariantParameters;
  fields: Fields;
}

const Title = (props: ComponentProps): JSX.Element => {
  return (
    <RenderingVariants
      fields={props.fields}
      componentName={props.rendering.componentName}
      params={props.rendering.params}
    />
  );
};

const ComponentContent = (props: any) => {
  return (
    <div className={`component title ${props.styles?.replace(/\|/g, ' ')}`}>
      <div className="component-content">
        <div className="field-title">{props.children}</div>
      </div>
    </div>
  );
};

export const Default = (props: RenderingVariantProps<Fields>): JSX.Element => {
  let datasource = props.fields?.data?.datasource || props.fields?.data?.contextItem;
  let text: TextField = {
    value: datasource?.field?.jsonValue?.value,
    editable: datasource?.field?.jsonValue?.editable,
  };
  let link: LinkFieldValue = {
    href: datasource?.url?.path,
    title: datasource?.field?.jsonValue?.value,
    editable: true,
  };
  if (useSitecoreContext().sitecoreContext.pageState !== 'normal') {
    link.href += `?sc_site=${datasource?.url?.siteName}`;
    if (!text.value) {
      text.value = "Title field";
      link.href = "#";
    }
  }
  return (
    <ComponentContent styles={props.styles}>
      <JssLink field={link}>
        <Text field={text} />
      </JssLink>
    </ComponentContent>
  );
};

export default Title;
