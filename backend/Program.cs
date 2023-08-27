using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using MyApp.Models;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using System;
using System.Text;
using AutoMapper;
using MyApp.Profiles;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(Program));
var connectionString = builder.Configuration.GetConnectionString("MyDBConnection");
builder.Services.AddDbContext<UserContext>(options =>
    options.UseNpgsql(connectionString));

var devCorsPolicy = "AllowOrigin";
builder.Services.AddCors(options =>
{
    options.AddPolicy(devCorsPolicy, builder =>
    {
        builder.WithOrigins("http://localhost:8000").AllowAnyMethod().AllowAnyHeader();

    });
});


var app = builder.Build();
app.UseCors();
app.UseStaticFiles();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("AllowOrigin");
}
else
{
    app.UseHttpsRedirection();
    app.UseHsts();
}

app.UseRouting();


app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();