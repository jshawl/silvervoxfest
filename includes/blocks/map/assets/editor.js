const { registerBlockType } = wp.blocks;
const { useBlockProps } = wp.blockEditor || wp.editor;
const { createElement: el } = wp.element;

registerBlockType("places/map", {
  edit: () => {
    const blockProps = useBlockProps({
      style: {
        border: "1px dashed #ccc",
        padding: "20px",
        minHeight: "100px",
      },
    });
    return el("div", blockProps, "Map");
  },
  save: () => null,
});
