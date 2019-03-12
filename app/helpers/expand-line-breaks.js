import { helper } from '@ember/component/helper';

export function expandLineBreaks(params) {
  var text = params[0];
  return text.replace(/\n/g, '<br>');
}

export default helper(expandLineBreaks);
