import React from 'react';
import {
  RenderingVariantParameters,
  ComponentRendering,
  Placeholder,
} from '@sitecore-jss/sitecore-jss-nextjs';

interface Fields {
}

interface ComponentProps {
  rendering: ComponentRendering & { params: RenderingVariantParameters };
  params: RenderingVariantParameters;
  fields: Fields;
}

const Container = (props: ComponentProps): JSX.Element => {
  var styles = `${props.params.GridParameters} ${props.params.Styles?.replace(/\|/g, ' ')}`;
  var phKey = `container-${props.params.DynamicPlaceholderId}`;
  if (props.rendering.placeholders && props.rendering.placeholders["container-{*}"]) {
    props.rendering.placeholders[phKey] = props.rendering.placeholders["container-{*}"];
    delete props.rendering.placeholders["container-{*}"];
  }
  return (
    <div className={`component container ${styles}`}>
      <div className="component-content">
        <div className="row">
          <Placeholder name={phKey} rendering={props.rendering} />
        </div>
      </div>
    </div>  
  )
};

export default Container;
