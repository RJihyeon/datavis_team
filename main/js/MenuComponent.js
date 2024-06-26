function renderMenuComponent() {
  const menuComponent = document.getElementById("menu-component");
  menuComponent.innerHTML = `
    <div class="menu_div">
      <p class="menu_title">가출 청소년 잠재적 원인 분석</p>
      <ul>
        <li class="side-nav__list on">
          <div class="menu fst_button">청소년 가출 현황</div>
          <ul class="sub_menu">
            <li>
              <div class="sub_button click active" id="runaway" onclick="setActiveComponent('runaway')">- 가출 여부</div>
            </li>
          </ul>
        </li>
      </ul>
      <ul>
        <li class="side-nav__list on">
          <div class="menu fst_button">잠재적 원인 관련 데이터</div>
          <ul class="sub_menu">
            <li>
              <div class="sub_button click" id="famtype" onclick="setActiveComponent('family-type')">- 한부모 가정 자녀</div>
            </li>
            <li>
              <div class="sub_button click" id="domviolence" onclick="setActiveComponent('dom-violence')">- 가정폭력</div>
            </li>
            <li>
              <div class="sub_button click" id="school" onclick="setActiveComponent('school-violence')">- 학교폭력</div>
            </li>
          </ul>
        </li>
      </ul>
      <ul>
        <li class="side-nav__list on">
          <div class="menu fst_button">인프라 데이터</div>
          <ul class="sub_menu">
            <li>
              <div class="sub_button click" id="social-infra" onclick="setActiveComponent('social-infra')">- 한부모가족 복지 시설 현황</div>
            </li>
            <li>
              <div class="sub_button click" id="social-infra" onclick="setActiveComponent('violence-infra')">- 가정폭력 교육</div>
            </li>
            <li>
              <div class="sub_button click" id="school" onclick="setActiveComponent('after-school-bully')">- 학교폭력 피해지원</div>
            </li>              
          </ul>
        </li>
      </ul>
    </div>
  `;

  // Attach event listeners to all sub_buttons
  const subButtons = document.querySelectorAll(".sub_button");
  subButtons.forEach((button) => {
    button.addEventListener("click", function () {
      subButtons.forEach((btn) => btn.classList.remove("active")); // Remove 'active' class from all buttons
      this.classList.add("active"); // Add 'active' class to the clicked button
    });
  });


}
