class ClickSpy {
  public eventType = "INTERACTION.CLICK";
  public onEvent(payload: unknown) {
    // console.log("received", payload);
  }
}
class HoverSpy {
  public eventType = "INTERACTION.HOVER";
  public onEvent(payload: unknown) {
    // console.log("received hover", payload);
  }
}

export { ClickSpy, HoverSpy };
