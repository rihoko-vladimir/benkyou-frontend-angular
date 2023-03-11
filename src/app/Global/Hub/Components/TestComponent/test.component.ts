import {Component, Input} from "@angular/core";
import Kanji from "../../../../Models/Kanji";

@Component({
  selector: "test-component",
  templateUrl: "test.component.html",
  styleUrls: ["test.component.css"]
})

export class TestComponent {
  @Input("kanji") kanji: Kanji = new Kanji("本", [',', ','], [',', ','])

}
