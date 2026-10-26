import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from '@tiptap/extension-table';


function optionalAttr(name: string) {
  return {
    default: null as string | null,
    parseHTML: (element: HTMLElement) => element.getAttribute(name),
    renderHTML: (attributes: Record<string, string | null>) => {
      const value = attributes[name];
      return value ? { [name]: value } : {};
    },
  };
}

/** Table attrs allowed by {@link de.dnb.sta.storage.JsoupFactory SAFELIST_*}. */
export const StaTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      summary: optionalAttr('summary'),
      width: optionalAttr('width'),
    };
  },
});

const cellExtraAttributes = {
  abbr: optionalAttr('abbr'),
  axis: optionalAttr('axis'),
  width: optionalAttr('width'),
};

export const StaTableRow = TableRow;

const suppressColwidth = {
  default: null as null,
  parseHTML: () => null,
  renderHTML: () => ({}),
};

export const StaTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...cellExtraAttributes,
      colwidth: suppressColwidth,
    };
  },
});

export const StaTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...cellExtraAttributes,
      scope: optionalAttr('scope'),
      colwidth: suppressColwidth,
    };
  },
});

export const staTableExtensions = [
  StaTable.configure({
    resizable: false,
  }),
  StaTableRow,
  StaTableHeader,
  StaTableCell,
];
