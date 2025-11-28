const stateIdentifiers = {
    1: "Andhra Pradesh",
    2: "Arunachal Pradesh",
    3: "Assam",
    4: "Bihar",
    5: "Chhattisgarh",
    6: "Goa",
    7: "Gujarat",
    8: "Haryana",
    9: "Himachal Pradesh",
    10: "Jharkhand",
    11: "Karnataka",
    12: "Kerala",
    13: "Madhya Pradesh",
    14: "Maharashtra",
    15: "Manipur",
    16: "Meghalaya",
    17: "Mizoram",
    18: "Nagaland",
    19: "Odisha",
    20: "Punjab",
    21: "Rajasthan",
    22: "Sikkim",
    23: "Tamil Nadu",
    24: "Telangana",
    25: "Tripura",
    26: "Uttar Pradesh",
    27: "Uttarakhand",
    28: "West Bengal"
};

const capitalIdentifiers = {
    1: "Agartala",
    2: "Aizawl",
    3: "Amaravati",
    4: "Bengaluru",
    5: "Bhopal",
    6: "Bhubaneswar",
    7: "Chandigarh",
    8: "Chennai",
    9: "Dehradun",
    10: "Dispur",
    11: "Gangtok",
    12: "Gandhinagar",
    13: "Hyderabad",
    14: "Imphal",
    15: "Itanagar",
    16: "Jaipur",
    17: "Kohima",
    18: "Kolkata",
    19: "Lucknow",
    20: "Mumbai",
    21: "Panaji",
    22: "Patna",
    23: "Raipur",
    24: "Ranchi",
    25: "Shillong",
    26: "Shimla",
    27: "Thiruvananthapuram"
};

let guessesObj = [];

$(document).ready(function () {
    $("#StateSelect").empty();
    $("#StateSelect").append("<option value=''>Select a State</option>");
    for (const [key, value] of Object.entries(stateIdentifiers)) {
        let option = document.createElement("option");
        option.value = key;
        option.textContent = value;
        $("#StateSelect").append(option);
    }

    $("#CapitalSelect").empty();
    $("#CapitalSelect").append("<option value=''>Select a Capital</option>");
    for (const [key, value] of Object.entries(capitalIdentifiers)) {
        let option = document.createElement("option");
        option.value = key;
        option.textContent = value;
        $("#CapitalSelect").append(option);
    }

    $(".selectpicker").selectpicker("destroy").selectpicker();
    $(".selectpicker").selectpicker("refresh");

    $(".IndiaMap path").on("click", function () {
        const $this = $(this);
        const correctState = $this.data("state");
        const correctCapital = $this.data("cap");

        let guess = guessesObj.find(x => x.CorrectState === correctState);
        if (guess) {
            $("#StateSelect").selectpicker("val", String(guess.GuessedState));
            $("#CapitalSelect").selectpicker("val", String(guess.GuessedCapital));
        }

        const clone = $this.clone().removeClass("CorrectState PartialState IncorrectState");
        const bbox = $this[0].getBBox();
        const padding = 10;
        const zoom = 1.1;
        const viewBoxX = bbox.x - padding * zoom;
        const viewBoxY = bbox.y - padding * zoom;
        const viewBoxW = (bbox.width + padding * 2) * zoom;
        const viewBoxH = (bbox.height + padding * 2) * zoom;

        $("#GuessModal #IndiaState").attr("viewBox", `${viewBoxX} ${viewBoxY} ${viewBoxW} ${viewBoxH}`);
        $("#GuessModal #IndiaState").css({ width: "300px", height: "auto", margin: "0 auto", display: "block" });
        $("#GuessModal #IndiaState").empty().append(clone);

        $("#GuessModal #SaveBtn").off("click").on("click", function () {
            if (!ValidInput()) {
                return;
            }

            if (!guess) {
                guessesObj.push({
                    CorrectState: correctState,
                    CorrectCapital: correctCapital,
                    GuessedState: null,
                    GuessedCapital: null,
                    Type: null // -1 = incorrect, 0 = partial, 1 = correct
                });

                guess = guessesObj[guessesObj.length - 1];
            }

            const isCorrectState = $("#StateSelect").val() == correctState;
            const isCorrectCapital = $("#CapitalSelect").val() == correctCapital;
            if (isCorrectState && isCorrectCapital) {
                if (guess.Type !== 1) {
                    const correct = parseInt($("#NumCorrect").text()) + 1;
                    $("#NumCorrect").text(correct);
                    $this.removeClass("PartialState IncorrectState").addClass("CorrectState");
                }

                switch (guess.Type) {
                    case -1:
                        const incorrect = parseInt($("#NumIncorrect").text()) - 1;
                        $("#NumIncorrect").text(incorrect);
                        break;
                    case 0:
                        const partial = parseInt($("#NumPartiallyCorrect").text()) - 1;
                        $("#NumPartiallyCorrect").text(partial);
                        break;
                    default:
                        break;
                }

                guess.Type = 1;
            }
            else if ((isCorrectState && !isCorrectCapital) || (!isCorrectState && isCorrectCapital)) {
                if (guess.Type !== 0) {
                    const partial = parseInt($("#NumPartiallyCorrect").text()) + 1;
                    $("#NumPartiallyCorrect").text(partial);
                    $this.removeClass("CorrectState IncorrectState").addClass("PartialState");
                }

                switch (guess.Type) {
                    case 1:
                        const correct = parseInt($("#NumCorrect").text()) - 1;
                        $("#NumCorrect").text(correct);
                        break;
                    case -1:
                        const incorrect = parseInt($("#NumIncorrect").text()) - 1;
                        $("#NumIncorrect").text(incorrect);
                        break;
                    default:
                        break;
                }

                guess.Type = 0;
            }
            else {
                if (guess.Type !== -1) {
                    const incorrect = parseInt($("#NumIncorrect").text()) + 1;
                    $("#NumIncorrect").text(incorrect);
                    $this.removeClass("PartialState CorrectState").addClass("IncorrectState");
                }

                switch (guess.Type) {
                    case 1:
                        const correct = parseInt($("#NumCorrect").text()) - 1;
                        $("#NumCorrect").text(correct);
                        break;
                    case 0:
                        const partial = parseInt($("#NumPartiallyCorrect").text()) - 1;
                        $("#NumPartiallyCorrect").text(partial);
                        break;
                    default:
                        break;
                }

                guess.Type = -1;
            }

            guess.GuessedState = parseInt($("#StateSelect").val());
            guess.GuessedCapital = parseInt($("#CapitalSelect").val());

            $("#GuessModal #CloseBtn").click();
        });

        $("#GuessModal #CloseBtn").off("click").on("click", function () {
            $("#GuessModal").modal("hide");
        });

        $("#GuessModal #TopCloseBtn").off("click").on("click", function () {
            $("#GuessModal #CloseBtn").click();
        });

        $("#GuessModal").modal("show");

        $("#StateSelect,#CapitalSelect").off("changed.bs.select").on("changed.bs.select", function () {
            ValidInput($(this));
        });

        $("#GuessModal").on("hidden.bs.modal", function () {
            $("#StateSelect").selectpicker("val", "");
            $("#CapitalSelect").selectpicker("val", "");
            $(this).find(".bootstrap-select .dropdown-toggle").removeClass("is-valid is-invalid");
            $(".invalid-feedback").hide();
            $("#GuessModal #IndiaState").empty();
        });
    });
});

function ValidInput($this = null) {
    let dropdowns = $(".bootstrap-select");
    if ($this) {
        dropdowns = $this.closest(".bootstrap-select");
    }

    let isValid = true;
    dropdowns.each(function () {
        const value = $(this).find("select.form-control");
        const elementValid = value.val() !== null && value.val() !== "";
        $(this).find('button.dropdown-toggle').toggleClass("is-valid", elementValid).toggleClass("is-invalid", !elementValid);

        if (!elementValid) {
            isValid = false;
            $(this).next(".invalid-feedback").css("display", "block");
        }
        else {
            $(this).next(".invalid-feedback").css("display", "none");
        }
    });

    return isValid;
}