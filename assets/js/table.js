window.onload = async () => {
  const years = [2021, 2022, 2023];
  const bracketFileName = "brackets-{year}.json";
  const qualifiedDividendsFileName = "qualified-dividends-{year}.json";
  const standardDeductionsFileName = "standard-deductions-{year}.json";
  const tablesPath = "./assets/tables/";
  const tabsEl = document.getElementById("header-tabs");
  const tablesEl = document.getElementById("table-tabs-wrapper");
  let isActive = true;

  const createTableBase = (id, year, caption, rows) => {
    return `<table class="responsive-table tabs-header">
    <caption>${year} ${caption}</caption>
    <thead>
      <tr>
      ${rows
        .map((row) => {
          return '<th scope="col">' + row + "</th>";
        })
        .join("")}
      </tr>
    </thead>
    <tbody id="${id}-${year}">

    </tbody>
  </table>`;
  };

  for await (const year of years) {
    const bracket = await fetch(
      `${tablesPath}${bracketFileName.replace("{year}", year)}`
    ).then((res) => res.json());
    const qualifiedDividends = await fetch(
      `${tablesPath}${qualifiedDividendsFileName.replace("{year}", year)}`
    ).then((res) => res.json());
    const standardDeductions = await fetch(
      `${tablesPath}${standardDeductionsFileName.replace("{year}", year)}`
    ).then((res) => res.json());
    const tabEl = document.createElement("span");
    const federalIncomeTableEl = document.createElement("div");

    if (isActive) {
      tabEl.classList.add("active");
      federalIncomeTableEl.classList.add("active");
      isActive = false;
    }
    tabEl.classList.add("header-tabs--item");
    tabEl.innerText = year;
    tabsEl.append(tabEl);

    federalIncomeTableEl.classList.add("table-tab");

    {
      // Federal income table
      federalIncomeTableEl.innerHTML = createTableBase(
        "bracket",
        year,
        "Federal Income Tax Brackets and Rates",
        [
          "Tax Rate",
          "For Single Filers, Taxable Income",
          "For Married Individuals Filing Joint Returns, Taxable Income",
          "For Heads of Households, Taxable Income",
          "Married Filing Separately",
        ]
      );
      tablesEl.appendChild(federalIncomeTableEl);

      const tbodyEl = document.getElementById(`bracket-${year}`);
      const getCellText = (value, index, length, next) => {
        if (index == 0) return `Up to ${value}`;
        else if (index > 0 && index < length - 1) return `${value} to ${next}`;
        else return `Over ${value}`;
      };

      let i = 0;
      const keys = Object.keys(bracket["single"]);
      keys.forEach((k) => {
        const trEl = document.createElement("tr");
        const taxRateEl = document.createElement("td");
        const singleEl = document.createElement("td");
        const marriedJointlyEl = document.createElement("td");
        const headHouseholdEl = document.createElement("td");
        const marriedSeparatelyEl = document.createElement("td");

        taxRateEl.innerText = k;
        singleEl.innerText = getCellText(
          bracket["single"][k].toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
          }),
          i,
          keys.length,
          bracket["single"][keys[i + 1]] &&
            bracket["single"][keys[i + 1]].toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            })
        );
        marriedJointlyEl.innerText = getCellText(
          bracket["marriedJointly"][k].toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
          }),
          i,
          keys.length,
          bracket["marriedJointly"][keys[i + 1]] &&
            bracket["marriedJointly"][keys[i + 1]].toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            })
        );
        headHouseholdEl.innerText = getCellText(
          bracket["headHousehold"][k].toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
          }),
          i,
          keys.length,
          bracket["headHousehold"][keys[i + 1]] &&
            bracket["headHousehold"][keys[i + 1]].toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            })
        );
        marriedSeparatelyEl.innerText = getCellText(
          bracket["marriedSeparately"][k].toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
          }),
          i,
          keys.length,
          bracket["marriedSeparately"][keys[i + 1]] &&
            bracket["marriedSeparately"][keys[i + 1]].toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            })
        );
        trEl.append(
          taxRateEl,
          singleEl,
          marriedJointlyEl,
          headHouseholdEl,
          marriedSeparatelyEl
        );
        tbodyEl.appendChild(trEl);
        i++;
      });
    }

    {
      // Qualified Dividends Table
      federalIncomeTableEl.innerHTML += createTableBase(
        "qualifiedDividends",
        year,
        "Qualified Dividends",
        [
          "",
          "For Unmarried Individuals, Taxable Income Over",
          "For Married Individuals Filing Joint Returns, Taxable Income Over",
          "For Heads of Households, Taxable Income Over",
        ]
      );

      const tbodyEl = document.getElementById(`qualifiedDividends-${year}`);

      const keys = Object.keys(qualifiedDividends["unmarried"]);
      keys.forEach((k) => {
        const trEl = document.createElement("tr");
        const taxRateEl = document.createElement("td");
        const unmarriedEl = document.createElement("td");
        const marriedJointlyEl = document.createElement("td");
        const headHouseholdEl = document.createElement("td");

        taxRateEl.innerText = k;
        unmarriedEl.innerText = qualifiedDividends["unmarried"][
          k
        ].toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        });
        marriedJointlyEl.innerText = qualifiedDividends["marriedJointly"][
          k
        ].toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        });
        headHouseholdEl.innerText = qualifiedDividends["headHousehold"][
          k
        ].toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        });

        trEl.append(taxRateEl, unmarriedEl, marriedJointlyEl, headHouseholdEl);
        tbodyEl.appendChild(trEl);
      });
    }

    {
      // Standard deductions Table
      federalIncomeTableEl.innerHTML += createTableBase(
        "standardDeductions",
        year,
        "Standard Deduction",
        ["Filing Status", "Deduction Amount"]
      );

      const tbodyEl = document.getElementById(`standardDeductions-${year}`);

      const singleRowEl = document.createElement("tr");
      const marriedJointlyRowEl = document.createElement("tr");
      const headHouseholdRowEl = document.createElement("tr");

      const singleEl = document.createElement("td");
      const marriedJointlyEl = document.createElement("td");
      const headHouseholdEl = document.createElement("td");

      singleRowEl.innerHTML = `<td>Single</td>`;
      marriedJointlyRowEl.innerHTML = `<td>Married Filing Jointly</td>`;
      headHouseholdRowEl.innerHTML = `<td>Head of Household</td>`;

      singleEl.innerText = standardDeductions["single"].toLocaleString(
        "en-US",
        {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        }
      );
      marriedJointlyEl.innerText = standardDeductions[
        "marriedJointly"
      ].toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      });
      headHouseholdEl.innerText = standardDeductions[
        "headHousehold"
      ].toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      });

      singleRowEl.appendChild(singleEl);
      marriedJointlyRowEl.appendChild(marriedJointlyEl);
      headHouseholdRowEl.appendChild(headHouseholdEl);
      tbodyEl.append(singleRowEl, marriedJointlyRowEl, headHouseholdRowEl);
    }
  }

  let tabs_content = document.querySelectorAll(".tabs-content .tab");
  let tab_header_items = document.querySelectorAll(".tab-header--item");

  for (let i = 0; i < tab_header_items.length; i++) {
    tab_header_items[i].addEventListener("click", (event) => {
      /*remove all "active" classes*/
      tab_header_items.forEach((e) => e.classList.remove("active"));

      //add "active" class to clicked element
      tab_header_items[i].classList.add("active");

      tabs_content.forEach((e) => e.classList.remove("active"));
      tabs_content[i].classList.add("active");
    });
  }

  let table_tabs_content = document.querySelectorAll(
    ".table-tabs-wrapper .table-tab"
  );
  let table_tab_header_items = document.querySelectorAll(
    ".header-tabs .header-tabs--item"
  );

  for (let i = 0; i < table_tab_header_items.length; i++) {
    table_tab_header_items[i].addEventListener("click", (event) => {
      /*remove all "active" classes*/
      table_tab_header_items.forEach((e) => e.classList.remove("active"));

      //add "active" class to clicked element
      table_tab_header_items[i].classList.add("active");

      table_tabs_content.forEach((e) => e.classList.remove("active"));
      table_tabs_content[i].classList.add("active");
    });
  }
};
