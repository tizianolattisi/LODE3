import {FormControl} from "@angular/forms";

export default function numberInString(c: FormControl) {
    let match = /[a-zA-Z]*[0-9]+[a-zA-Z]*/.test(c.value);
    return match ? null : {
        validatePassNumber: {
            valid: false
        }
    }
}
