
<%= renderer.include('block/logo.tpl') %>
<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/headline.tpl') %>
<%= renderer.include('block/system-message.tpl', {
  text:_x_invited_you_to_videoconference.format(sender)
  })
%>

<% if(!_.isEmpty(message)) { %>
  <%= renderer.include('block/costum-message.tpl', {text:message}) %>
<% } %>
<%= renderer.include('block/field.tpl', {name: lex._title, value:title}) %>
<%= renderer.include('block/field.tpl', {name: lex._date, value:date}) %>
<%= renderer.include('block/field.tpl', {name: lex._subject, value:subject}) %>
<%= renderer.include('block/link.tpl', {label: lex._access_videoconference}) %>
<%= renderer.include('block/signature.tpl') %>
