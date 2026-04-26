const { registerBlockType } = wp.blocks;
const { useBlockProps, InspectorControls } = wp.blockEditor || wp.editor;
const { createElement: el } = wp.element;
const { PanelBody, TextControl } = wp.components;

registerBlockType("places/map", {
  edit: ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps({
      style: {
        border: "1px dashed #ccc",
        padding: "20px",
        minHeight: "100px",
        height: attributes.height || "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    });
    return el(
      "div",
      blockProps,
      el(
        InspectorControls,
        null,
        el(
          PanelBody,
          { title: "Map Settings", initialOpen: true },
          el(TextControl, {
            label: "Height",
            value: attributes.height,
            onChange: (val) => setAttributes({ height: val }),
          }),
        ),
      ),
      "Map",
    );
  },
  save: () => null,
});
