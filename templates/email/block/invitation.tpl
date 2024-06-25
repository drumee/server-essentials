<div class="invitation_cont"> 
  <div class="invitation_container">
    <div class="invitation_account">
      <p class="account" style="color: #4A90E2;font-family: Verdana, sans-serif;
            font-size: 15px;line-height: 24px;text-align: left;font-weight: 450; margin-bottom: 0px;">
            <%= _drumee_no_account %></p>
      <p class="invitation_text"><%= _drumee_no_account_text %></p>
       <%= renderer.include('block/link.tpl', {label: _join_drumee}) %>
    </div>
    <div class="invitation_account">
      <p class="account" style="color: #4A90E2;font-family: Verdana, sans-serif;
            font-size: 15px;line-height: 24px;text-align: left;font-weight: 450;margin-bottom: 0px;">
            <%= _already_account_drumee %></p>
      <p class="invitation_text"><%= _drumee_account_text %></p>
      <!--span class="drumee-text"><%= message %></span-->
       <%= renderer.include('block/link.tpl', {label:_send_email_drumee , link : loginlink}) %>
    </div>
  </div>
</div>
