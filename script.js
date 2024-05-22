let currentFormula = simpson;

const simpsonBtn = document.getElementById("simpsonBtn");
const trapezoidBtn = document.getElementById("trapezoidBtn");
const medianRectangleBtn = document.getElementById("medianRectangleBtn");
const answerContainer = document.getElementById("answer");
simpsonBtn.onclick = function () {
  currentFormula = simpson;
};

trapezoidBtn.onclick = function () {
  currentFormula = trapezoidFormula;
};

medianRectangleBtn.onclick = function () {
  currentFormula = medianRectangleFormula;
};

function f(x) {
  return Math.exp(Number(x));
}

function simpson(abscissList) {
  let result = 0;
  console;
  for (let i = 0; i < abscissList.length - 1; i++) {
    result += Number(
      ((f(abscissList[i]) +
        4 * f((abscissList[i] + abscissList[i + 1]) / 2) +
        f(abscissList[i + 1])) *
        (abscissList[i + 1] - abscissList[i])) /
        6
    );
  }
  return result;
}

function trapezoidFormula(abscissList) {
  let result = 0;
  for (let i = 0; i < abscissList.length - 1; i++) {
    result +=
      ((f(abscissList[i]) + f(abscissList[i + 1])) *
        (abscissList[i + 1] - abscissList[i])) /
      2;
  }
  return result;
}

function medianRectangleFormula(abscissList) {
  let result = 0;
  for (let i = 0; i < abscissList.length - 1; i++) {
    result +=
      f((abscissList[i] + abscissList[i + 1]) / 2) *
      (abscissList[i + 1] - abscissList[i]);
  }
  return result;
}

function createAbscissList(n, left, right) {
  const abscissList = [];
  for (let i = 0; i < n - 1; i++)
    abscissList.push(left + (i * (right - left)) / (n - 1));
  abscissList.push(right);
  //console.log("createAbscissList->>>", n, left, right, abscissList);
  return abscissList;
}

function calculateIntegral(pointsNumber, left, right) {
  const abscissList = createAbscissList(pointsNumber, left, right);
  return currentFormula(abscissList);
  //return simpson(abscissList);
}

function calculateWithAccurasy(eps, left, right) {
  let n = 2;
  let value1 = calculateIntegral(n, left, right);
  let value2 = calculateIntegral(n * 2, left, right);

  while (Math.abs(value1 - value2) > eps) {
    n *= 2;
    if (n > 1e7) return null;

    value1 = calculateIntegral(n, left, right);
    value2 = calculateIntegral(n * 2, left, right);
  }

  return value2;
}

function calculateIndefinedIntegral(eps, left, B) {
  let value1 = calculateWithAccurasy(eps, left, B);
  let value2 = calculateWithAccurasy(eps, left, 2 * B);
  let iterationCaunter = 0;
  while (Math.abs(value1 - value2) > eps) {
    iterationCaunter++;
    B *= 2;
    value1 = value2;
    value2 = calculateWithAccurasy(eps, left, 2 * B);
    console.log(value1, value2);
    if (
      Math.abs(value1 - value2) > 1e10 ||
      iterationCaunter > 20 ||
      !value2 ||
      !value1
    )
      return null;
  }

  return value2;
}

const btn = document.getElementById("startBtn");
btn.onclick = function () {
  const eps = Number(document.getElementById("epsilonInput").value);
  const left = Number(document.getElementById("leftInput").value);
  const right = Number(document.getElementById("rightInput").value);
  const B = Number(document.getElementById("B").value);

  answerContainer.innerHTML = `<h3>
      Definite integral [a; b] : ${String(
        calculateWithAccurasy(eps, left, right)
      )}<br>
      Indefinite integral [a; +∞] : ${calculateIndefinedIntegral(eps, left, B)} 
    </h3>`;
};
