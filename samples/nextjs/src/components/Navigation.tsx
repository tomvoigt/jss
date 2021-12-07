import React, { Children } from 'react';
import {
  RenderingVariants,
  RenderingVariantProps,
  RenderingVariantParameters,
  Image as JssImage,
  Link as JssLink,
  ImageField,
  Field,
  LinkField,
  Text,
  ComponentRendering,
} from '@sitecore-jss/sitecore-jss-nextjs';

interface Fields {
  Id: string;
  DisplayName: string;
  Title: Text;
  NavigationTitle: Text;
  Href: string;
  Children: Array<Fields>;
  Styles: string[];
}

interface ComponentProps {
  rendering: ComponentRendering & { params: RenderingVariantParameters };
  params: RenderingVariantParameters;
  fields: Array<Fields>;
}

let getNavigationText = function (props: any): string {
  let text;
  if (props.fields.NavigationTitle) {
    text = <Text field={props.fields.NavigationTitle.NavigationTitle} />
  } else if (props.fields.Title) {
    text = <Text field={props.fields.Title.Title} />
  } else {
    text = props.fields.DisplayName;
  }
  return text;
};

const Navigation = (props: ComponentProps): JSX.Element => {
  const list = [];  
  for (let i = 0; i < Object.values(props.fields).length; i++) {
    const element = props.fields[i]; 
    if (element) {
      list.push(<NavigationList fields={element} />);
    }
  }

  return (
    <div className={`component navigation`}>
      <div className="component-content">
        <nav>
          <ul className="clearfix">      
            {list}
          </ul>                                  
        </nav>        
      </div>
    </div>
  );
};

const NavigationList = (props: any) => {

  let text = getNavigationText(props);

  if (props.fields.Children && props.fields.Children.length > 0) {

    let children = [];

    props.fields.Children.map((element:Fields) => {
      children.push(<NavigationList fields={element} />);
    });    

    return (            
      <li className={props.fields.Styles.join(" ")} key={props.fields.Id}>
          <div className="navigation-title">
            <a title={props.fields.DisplayName} href={props.fields.Href}>{text}</a>
          </div>
          <ul className="clearfix">
            {children}
          </ul>
      </li>     
    )
  } else { 
    return (
      <li className={props.fields.Styles.join(" ")} key={props.fields.Id}>
          <div className="navigation-title">
            <a title={props.fields.DisplayName} href={props.fields.Href}>{text}</a>
          </div>
      </li>     
    )
  }
}

export default Navigation;
