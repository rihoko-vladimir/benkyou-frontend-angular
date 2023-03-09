import {Component, Input} from "@angular/core";

@Component({
  selector: "test-component",
  templateUrl: "test.component.html",
  styleUrls: ["test.component.css"]
})

export class TestComponent {
  @Input("readings") readings: string[] = ["死", "b", "c", "a", "b", "c", "a", "b", "c", "漢字", "b", "c", "母", "b", "c", "a", "b", "c", "a", "b", "c", "a", "b", "c", "a", "b", "c"]
}
