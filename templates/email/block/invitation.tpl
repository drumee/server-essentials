<div class="invitation_cont"> 
  <div class="invitation_container">
    <div class="invitation_account">
      <p class="account" style="color: #b255f9;font-family: Armin Grotesk, sans-serif;
            font-size: 15px;line-height: 24px;text-align: left;font-weight: 450; margin-bottom: 0px;">
            <%= lex._drumee_no_account %></p>
      <p class="invitation_text"><%= lex._drumee_no_account_text %></p>
       <%= renderer.include('block/link.tpl', {label: _join_drumee}) %>
    </div>
    <div class="invitation_account">
      <p class="account" style="color: #b255f9;font-family: Armin Grotesk, sans-serif;
            font-size: 15px;line-height: 24px;text-align: left;font-weight: 450;margin-bottom: 0px;">
            <%= lex._already_account_drumee %></p>
      <p class="invitation_text"><%= lex._drumee_account_text %></p>
       <%= renderer.include('block/link.tpl', {label:_send_email_drumee , link : loginlink}) %>
    </div>
  </div>
</div>
