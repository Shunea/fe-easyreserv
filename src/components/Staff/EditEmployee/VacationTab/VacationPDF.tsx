import React from "react";
import { format } from "date-fns";

interface FormularProps {
  vacation?: any;
  employee: any;
}
export const VacationPDF = React.forwardRef<HTMLDivElement, FormularProps>(
  ({ vacation, employee }, ref) => {
    return (
      <div style={{ padding: "40px" }} ref={ref}>
        <p style={{ alignItems: "center", justifyContent: "center" }}>
          Domnule Director {vacation.id}, Subsemnata/ul {employee.username},
          angajat/a în funția de {employee.role}, rog să–mi acordaţi concediu de
          odihnă anual
          {/* cu o durată de {vacation.requestedDays} zile calendaristice pentru
          perioada {format(new Date(vacation.startDate), "dd-MM-yyyy")} -{" "}
          {format(new Date(vacation.endDate), "dd-MM-yyyy")} */}
        </p>
        <p style={{ marginTop: "50px" }}>
          Semnatura angajatului {"      "} __________
        </p>
      </div>
    );
  }
);
VacationPDF.displayName = "Vacation";
export default VacationPDF;
