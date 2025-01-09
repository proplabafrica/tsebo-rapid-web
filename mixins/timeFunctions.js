import { orderBy } from "lodash";

const methods = {
  getNearestUnit(timeInHours) {
    timeInHours = parseFloat(timeInHours);

    var value, unit, unitInHours;

    const timeUnits = orderBy(
      this.getTimeUnits(["hour", "day", "week", "year"]),
      ["value"],
      ["asc"]
    );
    timeUnits.forEach((timeUnit) => {
      if (timeInHours / timeUnit.value >= 1) {
        value = Math.round(timeInHours / timeUnit.value);
        unit = timeUnit.name;
        unitInHours = timeUnit.value;
      }
    });

    return { value, unit, unitInHours };
  },
  getTimeUnits(units) {
    const timeUnits = [
      { name: "minute", value: 1 / 60 },
      { name: "hour", value: 1 },
      { name: "day", value: 24 },
      { name: "week", value: 24 * 7 },
      { name: "year", value: 24 * 365.25 }
    ];

    return timeUnits.filter((timeUnit) => {
      return units.includes(timeUnit.name);
    });
  },
  getTimeUnitsInSeconds(units) {
    return this.getTimeUnits(units).map((unit) => {
      unit.value *= 3600;
      return unit;
    });
  },
  secondsToReadableTime(seconds, units, toString = null) {
    units = orderBy(this.getTimeUnitsInSeconds(units), ["value"], ["desc"]);
    const results = [];
    units.forEach((unit) => {
      const unitValue = Math.floor(seconds / unit.value);
      seconds -= unitValue * unit.value;
      if (unitValue > 0) {
        results.push({
          name: unit.name,
          value: unitValue
        });
      }
    });
    if (toString == "long") {
      var text = "";
      results.forEach((result) => {
        text += `${result.value} ${result.name}(s) `;
      });
      return text;
    }
    if (toString == "short") {
      var text = "";
      results.forEach((result) => {
        name = result.name.substring(0, 1);
        text += `${result.value} ${name} `;
      });
      return text;
    }
    return results;
  },
  timeDiffCalc(dateFuture, dateNow) {
    dateFuture = new Date(dateFuture);
    dateNow = new Date(dateNow);

    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;

    let difference = "";
    if (days > 0) {
      difference += days === 1 ? `${days} day, ` : `${days} days, `;
    }

    difference +=
      hours === 0 || hours === 1 ? `${hours} hour, ` : `${hours} hours, `;

    difference +=
      minutes === 0 || hours === 1
        ? `${minutes} minutes`
        : `${minutes} minutes`;

    return difference;
  },
  readableTime(timeInMilliseconds) {
    return methods.secondsToReadableTime(
      timeInMilliseconds / 1000,
      ["minute", "hour", "day", "week", "year"],
      "long"
    );
  },
  shortReadableTime(timeInMilliseconds) {
    return methods.secondsToReadableTime(
      timeInMilliseconds / 1000,
      ["minute", "hour", "day", "week", "year"],
      "short"
    );
  }
};

export default {
  methods,
  filters: {
    readableTime(timeInMilliseconds) {
      return methods.secondsToReadableTime(
        timeInMilliseconds / 1000,
        ["minute", "hour", "day", "week", "year"],
        "long"
      );
    },
    shortReadableTime(timeInMilliseconds) {
      return methods.secondsToReadableTime(
        timeInMilliseconds / 1000,
        ["minute", "hour", "day", "week", "year"],
        "short"
      );
    }
  }
};
